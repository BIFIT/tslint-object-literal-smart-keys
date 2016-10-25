import * as Lint from "tslint/lib/lint";
import * as ts from "typescript";

import {
    PropWithNode,
    compareWithType,
    getPropsFromObjectLiteral,
    getPropsFromType,
} from "./utils";

export class Rule extends Lint.Rules.TypedRule {
    static metadata: Lint.IRuleMetadata = {
        ruleName: "object-literal-smart-keys",
        type: "maintainability",
        description: "Requires keys in object literals to be sorted like match interface or type",
        descriptionDetails: "",
        options: null,
        requiresTypeInfo: true,
    };

    static FAILURE_STRING_FACTORY(name: string, typeName: string) {
        return `The key '${name}' is not sorted like in type '${typeName}'`;
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
            this.fail(result, this.getTypeChecker().typeToString(type));
        }

        super.visitObjectLiteralExpression(obj);
    }

    protected fail(prop: PropWithNode, typeName: string) {
        this.addFailure(this.createFailure(
            prop.node.getStart(), prop.node.getWidth(), Rule.FAILURE_STRING_FACTORY(prop.name, typeName)
        ));
    }
}
