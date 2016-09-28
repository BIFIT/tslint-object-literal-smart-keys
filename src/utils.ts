import * as ts from "typescript";

export type Props = string[];

export function isObjectLiteral(node: ts.Node): node is ts.ObjectLiteralExpression {
    return node.kind === ts.SyntaxKind.ObjectLiteralExpression;
}

export function getPropsFromObjectLiteral(node: ts.ObjectLiteralExpression) {
    return node.properties.map(p => (p.name as ts.Identifier).text);
}

export function getPropsFromType(type: ts.Type | undefined) {
    return type ? type.getProperties().map((p) => p.name) : [];
}

export function isFunctionLike(node: ts.Node): node is ts.FunctionLikeDeclaration {
    return (
        node.kind === ts.SyntaxKind.ArrowFunction ||
        node.kind === ts.SyntaxKind.FunctionDeclaration ||
        node.kind === ts.SyntaxKind.FunctionExpression
    );
}

export function compareWithType(props: Props, typeProps: Props): string | null {
    let lastIndex = -1;

    for (const prop of props) {
        const ind = typeProps.indexOf(prop);
        if (ind === -1) {
            continue;
        }
        if (ind < lastIndex) {
            return prop;
        }
        lastIndex = ind;
    }

    return null;
}
