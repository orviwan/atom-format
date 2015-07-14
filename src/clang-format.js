var child_process_1 = require('child_process');
var os = require('os');
var fs = require('fs');
var atom_1 = require('atom');
var ClangFormat = (function () {
    function ClangFormat() {
        var _this = this;
        this.subscriptions = new atom_1.CompositeDisposable();
        console.log('constructor...');
        var editor = atom.workspace.getActiveEditor();
        this.subscriptions.add(editor.onDidSave(function () { _this._format(editor.getPath()); }));
    }
    ClangFormat.prototype.destroy = function () {
        console.log('destroy...');
        this.subscriptions.dispose();
    };
    ClangFormat.prototype._format = function (filepath) {
        var binary = atom.config.get('atom-format.executable');
        if (!binary) {
            binary = './bin/' + os.platform() + "_" + os.arch() + '/clang-format' +
                ((os.platform() === 'win32') ? '.exe' : '');
        }
        if (!fs.existsSync(binary))
            throw new Error("Doesn't bundle the clang-format executable for your platform(" +
                os.platform() + "_" + os.arch() +
                "). Consider installing it with your native package manager instead. " +
                binary);
        var args = JSON.stringify(atom.config.get('atom-format.style'));
        console.log(args);
        return child_process_1.spawn(binary, ['-i', '-style=' + args, filepath], { stdio: ['ignore', 'pipe', process.stderr] });
    };
    return ClangFormat;
})();
exports.ClangFormat = ClangFormat;
