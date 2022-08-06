import Generator from "yeoman-generator";

const NAME = 0;

export class GeneratorDevContainer extends Generator {
  private _args: any;
  private _opts: any;

  public constructor(args: any, opts: any) {
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
  }
}
