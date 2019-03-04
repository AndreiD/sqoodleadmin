import React from 'react';
import BadgeSummary from './BadgeSummary';

function BadgeList(props) {
  return (
    <div className="container">
      <BadgeSummary title="abc" metadata="def" />
      <BadgeSummary title="abc" metadata="def" />
      <BadgeSummary title="abc" metadata="def" />

    </div>
  )
}

export default BadgeList;
