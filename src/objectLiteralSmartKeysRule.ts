import * as Lint from "tslint/lib/lint";
import * as ts from "typescript";

import {
    getClosestFunction,
    isObjectLiteral,
} from "./utils";

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
        ruleName: "object-literal-smart-keys",
        description: "Requires keys in object literals to be sorted like corresponding interface or type",
        descriptionDetails: "",
        options: null,
        requiresTypeInfo: true,
        type: "maintainability",
    };

    public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const walker = new ObjectLiteralSmartKeysWalker(sourceFile, this.getOptions(), program);
        return this.applyWithWalker(walker);
    }
}

// The walker takes care of all the work.
class ObjectLiteralSmartKeysWalker extends Lint.ProgramAwareRuleWalker {

    // visitVariableDeclaration(node: ts.VariableDeclaration) {
    //     const tc = this.getTypeChecker();

    //     super.visitVariableDeclaration(node);
    // }

    // visitFunctionDeclaration(node: ts.FunctionDeclaration) {
    //     const tc = this.getTypeChecker();

    //     super.visitFunctionDeclaration(node);
    // }

    visitReturnStatement(node: ts.ReturnStatement) {
        const {expression} = node;
        if (!expression) {
            super.visitReturnStatement(node);
            return;
        }
        if (isObjectLiteral(expression)) {
            const originProps = this.getPropsFromFunction(node);
            const props = expression.properties.map(p => (p.name as ts.Identifier).text);

            const result = compareWithDef(props, originProps);
            if (!result) {
                this.addFailure(
                    this.createFailure(expression.getStart(), expression.getWidth(), "Fuck")
                );
            }
        }
        super.visitReturnStatement(node);
    }

    protected getPropsFromFunction(node: ts.ReturnStatement) {
        const func = getClosestFunction(node);
        if (func && func.type) {
            const type = this.getTypeChecker().getTypeAtLocation(func.type);
            return type.getProperties().map(p => p.name);
        }
        return [];
    }
}
