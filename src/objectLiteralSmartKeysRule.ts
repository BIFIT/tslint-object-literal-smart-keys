import * as Lint from "tslint/lib/lint";
import * as ts from "typescript";

import {
    compareWithType,
    getPropsFromObjectLiteral,
    getPropsFromType,
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

    static FAILURE_STRING_FACTORY(name: string, typeName: string) {
        return `The key '${name}' is not sorted like in type ${typeName}`;
    }

    applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
        const walker = new ObjectLiteralSmartKeysWalker(sourceFile, this.getOptions(), program);
        return this.applyWithWalker(walker);
    }
}

class ObjectLiteralSmartKeysWalker extends Lint.ProgramAwareRuleWalker {

    visitObjectLiteralExpression(obj: ts.ObjectLiteralExpression) {
        const type = this.getTypeChecker().getContextualType(obj);
        const typeProps = getPropsFromType(type);

        const props = getPropsFromObjectLiteral(obj);
        const result = compareWithType(props, typeProps);
        if (result) {
            this.fail(obj, result);
        }

        super.visitObjectLiteralExpression(obj);
    }

    protected fail(node: ts.Node, propName: string) {
        this.addFailure(this.createFailure(
            node.getStart(), node.getWidth(), Rule.FAILURE_STRING_FACTORY(propName, "Type")
        ));
    }
}
