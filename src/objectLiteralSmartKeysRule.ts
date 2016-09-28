import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

function compareWithDef(props, def): boolean {
    let lastIndex = -1;

    for (const prop of props) {
        const ind = def.indexOf(prop);
        if (ind === -1) {
            continue;
        }
        if (ind < lastIndex) {
            return false;
        }
        lastIndex = ind;
    }

    return true;
}

export class Rule extends Lint.Rules.TypedRule {
    public static metadata: Lint.IRuleMetadata = {
        ruleName: 'object-literal-smart-keys',
        description: '',
        descriptionDetails: '',
        options: null,
        requiresTypeInfo: true,
        type: 'functionality',
    }

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const walker = new ObjectLiteralSmartKeysWalker(sourceFile, this.getOptions(), program);
        return this.applyWithWalker(walker);
    }
}

function isObjectLiteral(node: ts.Node): node is ts.ObjectLiteralExpression {
    return node.kind === ts.SyntaxKind.ObjectLiteralExpression;
}

// The walker takes care of all the work.
class ObjectLiteralSmartKeysWalker extends Lint.ProgramAwareRuleWalker {

    protected functionsStack = [];

    visitVariableDeclaration(node: ts.VariableDeclaration) {
        const tc = this.getTypeChecker();

        super.visitVariableDeclaration(node);
    }

    visitFunctionDeclaration(node: ts.FunctionDeclaration) {
        const tc = this.getTypeChecker();

        super.visitFunctionDeclaration(node);
    }

    visitReturnStatement(node: ts.ReturnStatement): void {
        const {expression} = node;
        if (!expression) {
            return super.visitReturnStatement(node);
        }
        if (isObjectLiteral(expression)) {
            const func = this.upToFunction(node);
            if (func && func.type) {
                const type = this.getTypeChecker().getTypeAtLocation(func.type);
                const originProps = type.getProperties().map(p => p.name);
                const props = expression.properties.map(p => (p.name as ts.Identifier).text);

                const result = compareWithDef(props, originProps);

                console.log(result ? 'ok' : 'fail');
            }
        }
        // call the base version of this visitor to actually parse this node
        super.visitReturnStatement(node);
    }

    protected upToFunction(node: ts.ReturnStatement): ts.FunctionLikeDeclaration | null {
        let parent: ts.FunctionLikeDeclaration | null = node.parent as ts.FunctionLikeDeclaration;
        do {
            parent = parent.parent as ts.FunctionLikeDeclaration;
        } while (parent &&
            !(
                parent.kind === ts.SyntaxKind.ArrowFunction ||
                parent.kind === ts.SyntaxKind.FunctionDeclaration ||
                parent.kind === ts.SyntaxKind.FunctionExpression
            )
        );

        return parent;
    }
}