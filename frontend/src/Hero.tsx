import { Fragment } from 'react';
import DocsGPT3 from './assets/cute_docsgpt3.svg';
import { useTranslation } from 'react-i18next';
export default function Hero({
  handleQuestion,
}: {
  handleQuestion: ({
    question,
    isRetry,
  }: {
    question: string;
    isRetry?: boolean;
  }) => void;
}) {
  const { t } = useTranslation();
  const demos = t('demo', { returnObjects: true }) as Array<{
    header: string;
    query: string;
  }>;
  return (
    <div
      className={`pt-20 sm:pt-0 pb-6 sm:pb-12 flex h-full  w-full flex-col  text-black-1000 dark:text-bright-gray sm:w-full px-2 sm:px-0`}
    >
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex items-center">
          <span className="p-0 text-4xl font-semibold">DocsGPT</span>
          <img className="mb-1 inline w-14 p-0" src={DocsGPT3} alt="docsgpt" />
        </div>

        <div className="mb-4 flex flex-col items-center justify-center dark:text-white"></div>
      </div>
      <div className="mb-16 grid w-full grid-cols-1 items-center gap-4 self-center text-xs sm:w-auto sm:gap-6  md:mb-0 md:text-sm lg:grid-cols-2">
        {demos?.map(
          (demo: { header: string; query: string }, key: number) =>
            demo.header &&
            demo.query && (
              <Fragment key={key}>
                <button
                  onClick={() => handleQuestion({ question: demo.query })}
                  className={`w-full rounded-full border bg-transparent px-6 py-4 text-left min-w-11/12 sm:min-w-[362px] focus:outline-none
                    border-dark-gray text-just-black hover:bg-cultured
                    dark:border-dim-gray dark:text-chinese-white dark:hover:bg-charleston-green`}
                >
                  <p className="mb-1 font-semibold text-black-1000 dark:text-bright-gray">
                    {demo.header}
                  </p>
                  <span className="text-gray-700 dark:text-gray-300 opacity-60">
                    {demo.query}
                  </span>
                </button>
              </Fragment>
            ),
        )}
      </div>
    </div>
  );
}
