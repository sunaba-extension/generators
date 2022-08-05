import Generator from "yeoman-generator";

export type GeneratorDevContainerOpts = {
  /**
   * Override the devcontainer.json properties
   */
  override: any;
};

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
    this.fs.copyTpl(
      this.templatePath("**/*"),
      this.destinationRoot(this._args.name),
      undefined,
      undefined,
      { globOptions: { dot: true } }
    );
  }
}
