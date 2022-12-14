import Generator from "yeoman-generator";

import GeneratorDevContainer from "@sunaba-extension/generator-dev-container";

const NAME = 0;

class GeneratorCInternal extends Generator {
  private _args: any;
  private _opts: any;

  public constructor(args: any, opts: any) {
    super(args, opts);
    this._args = args;
    this._opts = opts;
  }
  public writing() {
    this.log("Writing files for C (gcc)");

    // render templates
    this.fs.copyTpl(
      this.templatePath("**/*"),
      this.destinationPath(this._args[NAME]),
      undefined,
      undefined,
      { globOptions: { dot: true } }
    );
  }
}

export class GeneratorC extends Generator {
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
      {
        args: this._args,
        "on-create-command":
          "nix develop -c /bin/bash ./.sunaba/scripts/link.sh",
      }
    );
    this.composeWith(
      {
        Generator: GeneratorCInternal,
        path: __dirname,
      },
      { args: this._args }
    );
  }
}
