import * as ts from "typescript";

export type PropName = string;
export type PropWithNode = { name: PropName; node: ts.Node };

export function getPropsFromObjectLiteral(node: ts.ObjectLiteralExpression): PropWithNode[] {
    return node.properties.map(p => ({
        name: (p.name as ts.Identifier).text,
        node: p,
    }));
}

export function getPropsFromType(type: ts.Type | undefined): PropName[] {
    return type ? type.getProperties().map((p) => p.name) : [];
}

export function compareWithType(props: PropWithNode[], typeProps: PropName[]): PropWithNode | null {
    let lastIndex = -1;

    for (const p of props) {
        const ind = typeProps.indexOf(p.name);
        if (ind === -1) {
            continue;
        }
        if (ind < lastIndex) {
            return p;
        }
        lastIndex = ind;
    }

    return null;
}
