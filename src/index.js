export default function ({ types: t }) {
  return {
    visitor: {
      ExportNamedDeclaration(path) {
        const { node } = path;
        const { declaration } = node;

        if (!declaration) {
          return;
        }

        const { loc } = node;
        const { start: { line: sline }, end: { line: eline } } = loc;
        const fileCode = path.hub.file.code;
        const code = fileCode.split('\n').slice(Math.max(sline - 1, 0), eline).join('\n');

        const { id, superClass, body, decorators } = declaration;
        const isFunc = t.isFunctionDeclaration(declaration);
        const isClass = t.isClassDeclaration(declaration);

        let member = null;
        let exportSpec = null;
        let exportDec = null;
        let assign = null;

        if (isFunc || isClass) {
          path.replaceWith(declaration);

          member = t.MemberExpression(id, t.Identifier('codeSelf'));
          assign = t.AssignmentExpression('=', member, t.StringLiteral(code));

          exportSpec = t.ExportSpecifier(id, id);
          exportDec = t.ExportNamedDeclaration(null, [exportSpec]);

          path.insertAfter(exportDec);
          path.insertAfter(t.ExpressionStatement(assign));
        }
      }
    }
  }
}
