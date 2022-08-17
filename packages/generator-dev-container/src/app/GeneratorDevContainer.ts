import path from "path";

import Generator from "yeoman-generator";

const NAME = 0;

export type GenerateDevContainerOpts = {
  onCreateCommand?: string[] | string;
};

export class GeneratorDevContainer extends Generator {
  private _args: any;
  private _opts: GenerateDevContainerOpts;

  public constructor(args: any, opts: GenerateDevContainerOpts) {
    super(args, opts);
    this.argument("name", { type: String, required: true });
    this._args = args;
    this._opts = opts;
  }
  public writing() {
    this.log("Writing files for dev container");
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

    // add optional commands to `onCreateCommand`
    if (this._opts.onCreateCommand) {
      const onCreateCommand: string = (
        this.fs.readJSON(devcontainerPath) as any
      )["onCreateCommand"];
      const onCreateCommandArr = onCreateCommand.split(" && ");
      let additionalCommands: string[];
      if (Array.isArray(this._opts.onCreateCommand)) {
        additionalCommands = this._opts.onCreateCommand;
      } else {
        additionalCommands = [this._opts.onCreateCommand];
      }
      onCreateCommandArr.splice(
        onCreateCommandArr.length - 1,
        0,
        ...additionalCommands
      );
      this.fs.extendJSON(devcontainerPath, {
        onCreateCommand: onCreateCommandArr.join(" && "),
      });
    }
  }
}
