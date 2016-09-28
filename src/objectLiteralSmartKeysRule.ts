import * as Lint from "tslint/lib/lint";
import * as ts from "typescript";

import {
    compareWithDef,
    // getClosestFunction,
    getPropsFromObjectLiteral,
    getPropsFromType,
    // isObjectLiteral,
} from "./utils";

export class Rule extends Lint.Rules.TypedRule {
    static metadata: Lint.IRuleMetadata = {
        ruleName: "object-literal-smart-keys",
        description: "Requires keys in object literals to be sorted like corresponding interface or type",
        descriptionDetails: "",
        options: null,
        requiresTypeInfo: true,
        type: "maintainability",
    };

    static FAILURE_STRING_FACTORY = (name: string) => `The key '${name}' is not sorted like in type`;

    applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
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

    visitObjectLiteralExpression(obj: ts.ObjectLiteralExpression) {
        const type = this.getTypeChecker().getContextualType(obj);
        const typeProps = getPropsFromType(type);

        const props = getPropsFromObjectLiteral(obj);
        const result = compareWithDef(props, typeProps);
        if (result) {
            this.fail(obj, result);
        }
    }

    // visitCallExpression(node: ts.CallExpression) {
    //     for (const arg of node.arguments) {
    //         if (isObjectLiteral(arg)) {
    //             const type = this.getTypeChecker().getContextualType(arg);
    //             const typeProps = getPropsFromType(type);
    //             const props = getPropsFromObjectLiteral(arg);

    //             const result = compareWithDef(props, typeProps);
    //             if (result) {
    //                 this.fail(arg, result);
    //             }
    //         }
    //     }
    //     super.visitCallExpression(node);
    // }

    // visitReturnStatement(node: ts.ReturnStatement) {
    //     const {expression} = node;
    //     if (expression) {
    //         // return { a: 1, b: 1 };
    //         if (isObjectLiteral(expression)) {
    //             const type = this.getTypeChecker().getContextualType(expression);
    //             const typeProps = getPropsFromType(type);
    //             // const originProps = this.getPropsFromFunction(node);
    //             const props = getPropsFromObjectLiteral(expression);

    //             const result = compareWithDef(props, typeProps);
    //             if (result) {
    //                 this.fail(expression, result);
    //             }
    //         }
    //         // return foo;
    //     }
    //     super.visitReturnStatement(node);
    // }

    // protected getPropsFromFunction(node: ts.ReturnStatement) {
    //     const func = getClosestFunction(node);
    //     if (func && func.type) {
    //         const type = this.getTypeChecker().getTypeAtLocation(func.type);
    //         return getPropsFromType(type);
    //     }
    //     return [];
    // }

    protected fail(node: ts.Node, propName: string) {
        this.addFailure(this.createFailure(
            node.getStart(), node.getWidth(), Rule.FAILURE_STRING_FACTORY(propName)
        ));
    }
}
