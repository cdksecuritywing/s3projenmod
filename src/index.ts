import * as fs from 'fs-extra'; // eslint-disable-line
import * as path from 'path'; // eslint-disable-line
import { AwsCdkTypeScriptApp, AwsCdkTypeScriptAppOptions, Component, SampleDir } from 'projen';
//  import { pascalCase } from './pascalCase';

export interface AwsCdkAppSyncAppOptions extends AwsCdkTypeScriptAppOptions {
}

/**
 * Demo Project in TypeScript
 *
 * @pjid demo-project
 */

////// Typescript App
export class DemoProject extends AwsCdkTypeScriptApp {
  public readonly projectName: string;

  constructor(options: AwsCdkAppSyncAppOptions) {
    super({
      ...options,
      sampleCode: false,

      // Custom project stuff
      licensed: false, // example: our private package is unlicensed because its org internal
    });

    this.projectName = path.basename(process.cwd());

    this.addCdkDependency(...[
      '@aws-cdk/aws-sns',
      '@aws-cdk/aws-sns-subscriptions',
    ]);

    if (options.sampleCode ?? true) {
      new SampleCode(this);
    }
  }
}

////// Typescript App ends


//sample code
class SampleCode extends Component {
  private readonly demoProject: DemoProject;
  private readonly devAccount = '11116666666';
  private readonly prodAccount = '666666666666';
  private readonly prodAccount2 = '999999999900';

  constructor(project: DemoProject) {
    super(project);
    this.demoProject = project;
  }

  public synthesize() {
    // Check if ts files exist. If so, do NOT create sample code
    if (fs.pathExistsSync(this.demoProject.srcdir) && fs.readdirSync(this.demoProject.srcdir).filter(x => x.endsWith('.ts'))) {
      return;
    }

    //  const projectType = pascalCase(this.demoProject.projectName);
    // const projectType = new string;

    new SampleDir(this.demoProject, this.demoProject.srcdir, {
      files: {
        'main.ts': this.createMainTsContents(this.demoProject.projectName),
      },
    });

    const libDir = path.join(this.demoProject.srcdir, 'lib');
    new SampleDir(this.demoProject, libDir, {
      files: {
        [`${this.demoProject.projectName}-stack.ts`]: this.projectStackContents(this.demoProject.projectName),
      },
    });

    //     const testCode = `import '@aws-cdk/assert/jest';
    // import { App } from '@aws-cdk/core';
    // import { ${projectType}Stack } from '../src/lib/${this.demoProject.projectName}-stack'
    // test('Basic Test', () => {
    //   const app = new App();
    //   const stack = new ${projectType}Stack(app, 'test');
    //   expect(stack).toHaveResource('AWS::SNS::Topic');
    // });`;

    //     const testdir = path.join(this.demoProject.testdir);
    //     new SampleDir(this.demoProject, testdir, {
    //       files: {
    //         'main.test.ts': testCode,
    //       },
    //     });
  }

  private createMainTsContents(projectName: string): string {
    return `import { App } from '@aws-cdk/core';
import { ${projectName}Stack } from './lib/${projectName}-stack';
const DEV_ACCOUNT = '${this.devAccount}';
const PROD_ACCOUNT = '${this.prodAccount}';
const PROD2_ACCOUNT = '${this.prodAccount2}';
const STAGE = process.env.STAGE || 'dev'; // default to dev as the stage
const ACCOUNT = process.env.ACCOUNT || DEV_ACCOUNT; // default to dev account
const REGION = process.env.REGION || 'eu-west-1'; // default region we are using
const app = new App(
  {
    context: {
      STAGE: STAGE,
      ACCOUNT: ACCOUNT,
      REGION: REGION,
      DEV_ACCOUNT: DEV_ACCOUNT,
      PROD_ACCOUNT: PROD_ACCOUNT,
      PROD2_ACCOUNT: PROD2_ACCOUNT,

    },
  },
);
new ${projectName}Stack(app, \`${projectName}-\${STAGE}\`, {
  terminationProtection: true,
  description: 'Stack for ${projectName}',
  env: {
    account: ACCOUNT,
    region: REGION,
  },
});
app.synth();`;
  }


  // custom template
  private projectStackContents(projectName: string): string {
    return `import { Construct, Stack, StackProps } from '@aws-cdk/core';
import * as s3mod from 's3newmodule';


export interface ${projectName}StackProps extends StackProps { }
const errorNotificationEmails = ['support@support.com'];

export class ${projectName}Stack extends Stack {
  constructor(scope: Construct, id: string, props?: ${projectName}StackProps) {
    super(scope, id, props);
    const STAGE = this.node.tryGetContext('STAGE');
     new s3mod.NotifyingBucket(this, 'MyNotifyingBucket', {
      prefix: 'images/',
      nameofBucket: "syras1-nation-bucket"
    });
    
  }
}`;

  }

  //////////  custom tempalte

}