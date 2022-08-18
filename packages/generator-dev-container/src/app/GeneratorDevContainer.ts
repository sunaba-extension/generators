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
    this._args = args;
    this._opts = opts;
    this.argument("name", { type: String, required: true });
    this.option("container-env", {
      type: String,
      description: "Additional environment variables encoded as JSON object",
    });
    this.option("on-create-command", {
      type: String,
      description: "Additional command to execute on container creation",
    });
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
    if (this.options["on-create-command"]) {
      const onCreateCommand: string = (
        this.fs.readJSON(devcontainerPath) as any
      )["onCreateCommand"];
      const onCreateCommandArr = onCreateCommand.split(" && ");
      onCreateCommandArr.splice(
        onCreateCommandArr.length - 1,
        0,
        this.options["on-create-command"]
      );
      this.fs.extendJSON(devcontainerPath, {
        onCreateCommand: onCreateCommandArr.join(" && "),
      });
    }

    // add additional environment variables
    if (this.options["container-env"]) {
      this.fs.extendJSON(devcontainerPath, {
        containerEnv: JSON.parse(this.options["container-env"]),
      });
    }
  }
}
