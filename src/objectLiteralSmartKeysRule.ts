import * as Lint from "tslint/lib/lint";
import * as ts from "typescript";

debugger;

type PropName = string;
type PropWithNode = { name: PropName; node: ts.Node };

const compareWithType = (props: PropWithNode[], typeProps: PropName[]): PropWithNode | null => {
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
};

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
        const checker = this.getTypeChecker();

        const type = checker.getContextualType(obj);
        const properties = checker.getPropertiesOfType(type);
        const typeProps = properties.map(prop => prop.getName());

        const props = obj.properties.map(prop => ({
            name: prop.name ? prop.name.getText() : '',
            node: prop,
        }));
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
