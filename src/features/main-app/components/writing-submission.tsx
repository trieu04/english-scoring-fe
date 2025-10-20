export function WritingSubmissionComponent({
  questionText,
  answerText,
}: {
  questionText: string;
  answerText: string;
}) {
  return (
    <div>
      {questionText && (
        <>
          <h3 className="mb-4">Task</h3>
          <div className="max-h-64 overflow-y-auto p-4 rounded-md border border-grey1 bg-line mb-4">
            {questionText.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </>
      )}
      <h3 className="mb-4">Submission</h3>
      <div className="h-64 overflow-y-auto bg-line p-4 rounded-md">
        {answerText.split("\n").map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
}
