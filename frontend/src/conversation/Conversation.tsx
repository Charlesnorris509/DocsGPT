import { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import DragFileUpload from '../assets/DragFileUpload.svg';
import newChatIcon from '../assets/openNewChat.svg';
import ShareIcon from '../assets/share.svg';
import MessageInput from '../components/MessageInput';
import { useMediaQuery } from '../hooks';
import { ShareConversationModal } from '../modals/ShareConversationModal';
import { ActiveState } from '../models/misc';
import {
  selectConversationId,
  selectSelectedAgent,
  selectToken,
} from '../preferences/preferenceSlice';
import { AppDispatch } from '../store';
import Upload from '../upload/Upload';
import { handleSendFeedback } from './conversationHandlers';
import ConversationMessages from './ConversationMessages';
import { FEEDBACK, Query } from './conversationModels';
import {
  addQuery,
  fetchAnswer,
  resendQuery,
  selectQueries,
  selectStatus,
  setConversation,
  updateConversationId,
  updateQuery,
} from './conversationSlice';

export default function Conversation() {
  const { t } = useTranslation();
  const { isMobile } = useMediaQuery();
  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector(selectToken);
  const queries = useSelector(selectQueries);
  const status = useSelector(selectStatus);
  const conversationId = useSelector(selectConversationId);
  const selectedAgent = useSelector(selectSelectedAgent);

  const [input, setInput] = useState<string>('');
  const [uploadModalState, setUploadModalState] =
    useState<ActiveState>('INACTIVE');
  const [files, setFiles] = useState<File[]>([]);
  const [lastQueryReturnedErr, setLastQueryReturnedErr] =
    useState<boolean>(false);
  const [isShareModalOpen, setShareModalState] = useState<boolean>(false);
  const [handleDragActive, setHandleDragActive] = useState<boolean>(false);

  const fetchStream = useRef<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadModalState('ACTIVE');
    setFiles(acceptedFiles);
    setHandleDragActive(false);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    multiple: true,
    onDragEnter: () => {
      setHandleDragActive(true);
    },
    onDragLeave: () => {
      setHandleDragActive(false);
    },
    maxSize: 25000000,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'text/x-rst': ['.rst'],
      'text/x-markdown': ['.md'],
      'application/zip': ['.zip'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
      'application/json': ['.json'],
      'text/csv': ['.csv'],
      'text/html': ['.html'],
      'application/epub+zip': ['.epub'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        ['.pptx'],
    },
  });

  const handleFetchAnswer = useCallback(
    ({ question, index }: { question: string; index?: number }) => {
      fetchStream.current = dispatch(fetchAnswer({ question, indx: index }));
    },
    [dispatch, selectedAgent],
  );

  const handleQuestion = useCallback(
    ({
      question,
      isRetry = false,
      index = undefined,
    }: {
      question: string;
      isRetry?: boolean;
      index?: number;
    }) => {
      const trimmedQuestion = question.trim();
      if (trimmedQuestion === '') return;

      if (index !== undefined) {
        if (!isRetry) dispatch(resendQuery({ index, prompt: trimmedQuestion }));
        handleFetchAnswer({ question: trimmedQuestion, index });
      } else {
        if (!isRetry) dispatch(addQuery({ prompt: trimmedQuestion }));
        handleFetchAnswer({ question: trimmedQuestion, index });
      }
    },
    [dispatch, handleFetchAnswer],
  );

  const handleFeedback = (query: Query, feedback: FEEDBACK, index: number) => {
    const prevFeedback = query.feedback;
    dispatch(updateQuery({ index, query: { feedback } }));
    handleSendFeedback(
      query.prompt,
      query.response!,
      feedback,
      conversationId as string,
      index,
      token,
    ).catch(() =>
      handleSendFeedback(
        query.prompt,
        query.response!,
        feedback,
        conversationId as string,
        index,
        token,
      ).catch(() =>
        dispatch(updateQuery({ index, query: { feedback: prevFeedback } })),
      ),
    );
  };

  const handleQuestionSubmission = (
    updatedQuestion?: string,
    updated?: boolean,
    indx?: number,
  ) => {
    if (updated === true) {
      handleQuestion({ question: updatedQuestion as string, index: indx });
    } else if (input && status !== 'loading') {
      if (lastQueryReturnedErr) {
        dispatch(
          updateQuery({
            index: queries.length - 1,
            query: {
              prompt: input,
            },
          }),
        );
        handleQuestion({
          question: queries[queries.length - 1].prompt,
          isRetry: true,
        });
      } else {
        handleQuestion({
          question: input,
        });
      }
      setInput('');
    }
  };

  const resetConversation = () => {
    dispatch(setConversation([]));
    dispatch(
      updateConversationId({
        query: { conversationId: null },
      }),
    );
  };

  const newChat = () => {
    if (queries && queries.length > 0) resetConversation();
  };

  useEffect(() => {
    if (queries.length) {
      queries[queries.length - 1].error && setLastQueryReturnedErr(true);
      queries[queries.length - 1].response && setLastQueryReturnedErr(false);
    }
  }, [queries[queries.length - 1]]);
  return (
    <div className="flex h-full flex-col justify-end gap-1">
      {conversationId && queries.length > 0 && (
        <div className="absolute right-20 top-4">
          <div className="mt-2 flex items-center gap-4">
            {isMobile && queries.length > 0 && (
              <button
                title="Open New Chat"
                onClick={() => {
                  newChat();
                }}
                className="rounded-full p-2 hover:bg-bright-gray dark:hover:bg-[#28292E]"
              >
                <img
                  className="h-5 w-5 filter dark:invert"
                  alt="NewChat"
                  src={newChatIcon}
                />
              </button>
            )}

            <button
              title="Share"
              onClick={() => {
                setShareModalState(true);
              }}
              className="rounded-full p-2 hover:bg-bright-gray dark:hover:bg-[#28292E]"
            >
              <img
                className="h-5 w-5 filter dark:invert"
                alt="share"
                src={ShareIcon}
              />
            </button>
          </div>
          {isShareModalOpen && (
            <ShareConversationModal
              close={() => {
                setShareModalState(false);
              }}
              conversationId={conversationId}
            />
          )}
        </div>
      )}

      <ConversationMessages
        handleQuestion={handleQuestion}
        handleQuestionSubmission={handleQuestionSubmission}
        handleFeedback={handleFeedback}
        queries={queries}
        status={status}
      />

      <div className="z-3 flex h-auto w-full max-w-[1300px] flex-col items-end self-center rounded-2xl bg-opacity-0 py-1 md:w-9/12 lg:w-8/12 xl:w-8/12 2xl:w-6/12">
        <div
          {...getRootProps()}
          className="flex w-full items-center rounded-[40px]"
        >
          <label htmlFor="file-upload" className="sr-only">
            {t('modals.uploadDoc.label')}
          </label>
          <input {...getInputProps()} id="file-upload" />
          <MessageInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSubmit={handleQuestionSubmission}
            loading={status === 'loading'}
            showSourceButton={selectedAgent ? false : true}
            showToolButton={selectedAgent ? false : true}
          />
        </div>

        <p className="hidden w-[100vw] self-center bg-transparent py-2 text-center text-xs text-gray-4000 dark:text-sonic-silver md:inline md:w-full">
          {t('tagline')}
        </p>
      </div>
      {handleDragActive && (
        <div className="pointer-events-none fixed left-0 top-0 z-30 flex size-full flex-col items-center justify-center bg-white bg-opacity-50 dark:bg-gray-alpha">
          <img className="filter dark:invert" src={DragFileUpload} />
          <span className="px-2 text-2xl font-bold text-outer-space dark:text-silver">
            {t('modals.uploadDoc.drag.title')}
          </span>
          <span className="text-s w-48 p-2 text-center text-outer-space dark:text-silver">
            {t('modals.uploadDoc.drag.description')}
          </span>
        </div>
      )}
      {uploadModalState === 'ACTIVE' && (
        <Upload
          receivedFile={files}
          setModalState={setUploadModalState}
          isOnboarding={false}
          renderTab={'file'}
          close={() => setUploadModalState('INACTIVE')}
        ></Upload>
      )}
    </div>
  );
}
