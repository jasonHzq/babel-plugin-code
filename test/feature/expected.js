import React from 'react';

class ActualDemo1 extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement(
      'div',
      null,
      'demo1'
    );
  }
}

ActualDemo1.codeSelf = 'export class ActualDemo1 extends React.Component {\n  constructor(props) {\n    super(props);\n  }\n\n  render() {\n    return (\n      <div>demo1</div>\n    );\n  }\n}';
export { ActualDemo1 };
function ActualDemo2(props) {
  return React.createElement(
    'div',
    null,
    'demo2'
  );
}
ActualDemo2.codeSelf = 'export function ActualDemo2(props) {\n  return (\n    <div>demo2</div>\n  );\n}';
export { ActualDemo2 };
