import path from "path";

import Generator from "yeoman-generator";

import GeneratorDevContainer from "@sunaba-extension/generator-dev-container";

const NAME = 0;

class GeneratorPython39Internal extends Generator {
  private _args: any;
  private _opts: any;

  public constructor(args: any, opts: any) {
    super(args, opts);
    this._args = args;
    this._opts = opts;
  }
  public writing() {
    this.log("Writing files for Python 3.9");

    // render templates
    this.fs.copyTpl(
      this.templatePath("**/*"),
      this.destinationPath(this._args[NAME]),
      undefined,
      undefined,
      { globOptions: { dot: true } }
    );

    const devcontainerPath = this.destinationPath(
      path.resolve(this._args[NAME], ".devcontainer/devcontainer.json")
    );

    const onCreateCommand: string = (this.fs.readJSON(devcontainerPath) as any)[
      "onCreateCommand"
    ];
    const onCreateCommandArr = onCreateCommand.split("&&");
    onCreateCommandArr.splice(
      onCreateCommandArr.length - 1,
      0,
      " nix develop -c poetry install "
    );
    this.fs.extendJSON(devcontainerPath, {
      onCreateCommand: onCreateCommandArr.join("&&"),
      containerEnv: {
        POETRY_VIRTUALENVS_IN_PROJECT: "1",
      },
    });
  }
}

export class GeneratorPython39 extends Generator {
  private _args: any;
  private _opts: any;

  public constructor(args: any, opts: any) {
    super(args, opts);
    this.argument("name", { type: String, required: true });
    this._args = args;
    this._opts = opts;
  }
  public initializing() {
    this.composeWith(
      {
        Generator: GeneratorDevContainer,
        path: require.resolve("@sunaba-extension/generator-dev-container"),
      },
      { args: this._args }
    );
    this.composeWith(
      {
        Generator: GeneratorPython39Internal,
        path: __dirname,
      },
      { args: this._args }
    );
  }
}
