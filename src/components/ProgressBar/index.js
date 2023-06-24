import React from "react";

const ProgressBar = ({ idQuestoin, maxQuestion }) => {
  const getWidth = (totalQuestion, questionId) => {
    return (100 / totalQuestion) * questionId;
  };

  const actualQuestion = idQuestoin + 1;
  const progressPercent = getWidth(maxQuestion, actualQuestion);

  return (
    <>
      <div className="percentage">
        <div className="progressPercent">{`Question: ${actualQuestion}/${maxQuestion}`}</div>
        <div className="progressPercent">{`Progression: ${progressPercent}%`}</div>
      </div>
      <div className="progressBar">
        <div
          className="progressBarChange"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </>
  );
};

export default React.memo(ProgressBar);
