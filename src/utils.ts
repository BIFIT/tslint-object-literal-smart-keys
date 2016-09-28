import * as ts from "typescript";

export function isObjectLiteral(node: ts.Node): node is ts.ObjectLiteralExpression {
    return node.kind === ts.SyntaxKind.ObjectLiteralExpression;
}

export function isFunctionLike(node: ts.Node): node is ts.FunctionLikeDeclaration {
    return (
        node.kind === ts.SyntaxKind.ArrowFunction ||
        node.kind === ts.SyntaxKind.FunctionDeclaration ||
        node.kind === ts.SyntaxKind.FunctionExpression
    );
}

export function getClosestFunction(node: ts.ReturnStatement) {
    let parent: ts.Node | undefined = node;
    do {
        parent = parent.parent;
    } while (parent && !isFunctionLike(parent));

    return parent;
}
