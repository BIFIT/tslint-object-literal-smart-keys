import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';

ts.getTypeParameterOwner

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

// The walker takes care of all the work.
class ObjectLiteralSmartKeysWalker extends Lint.ProgramAwareRuleWalker {
    public visitReturnStatement(node: ts.ReturnStatement) {
        const {expression} = node;
        if (expression) {
            const tc = this.getTypeChecker();
            const type = tc.getTypeAtLocation(expression);
            console.log(type);
        }
        // call the base version of this visitor to actually parse this node
        super.visitReturnStatement(node);
    }
}