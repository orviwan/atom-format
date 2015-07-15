var child_process_1 = require('child_process');
var os = require('os');
var fs = require('fs');
var atom_1 = require('atom');
var ClangFormat = (function () {
    function ClangFormat() {
        var _this = this;
        this.subscriptions = new atom_1.CompositeDisposable();
        this.subscriptions.add(atom.commands.add('atom-workspace', 'atom-format:format', function () {
            var editor = atom.workspace.getActiveTextEditor();
            if (editor) {
                _this._format(editor);
            }
        }));
        this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
            _this.subscriptions.add(editor.getBuffer().onWillSave(function () {
                var autoSave = atom.config.get('atom-format.autoSave');
                var extension = (editor.getPath().match(/\..+?$/) || [])[0];
                if (autoSave.indexOf(extension) >= 0)
                    _this._format(editor);
            }));
        }));
    }
    ClangFormat.prototype.destroy = function () {
        this.subscriptions.dispose();
    };
    ClangFormat.prototype._format = function (editor) {
        var binary = atom.config.get('atom-format.executable');
        if (!binary) {
            binary = './bin/' + os.platform() + "_" + os.arch() + '/clang-format' +
                ((os.platform() === 'win32') ? '.exe' : '');
        }
        if (!fs.existsSync(binary))
            throw new Error("Doesn't bundle the clang-format executable for your platform(" +
                os.platform() + "_" + os.arch() +
                "). Consider installing it with your native package manager instead.");
        var command = "" + binary;
        var options = { stdio: ['pipe', 'pipe', 'ignore'], input: editor.getText() };
        var args = {
            'style': JSON.stringify(atom.config.get('atom-format.style')),
            'assume-filename': editor.getPath(),
        };
        for (var k in args)
            command += " -" + k + "=" + args[k];
        editor.getBuffer().setTextViaDiff(child_process_1.execSync(command, options).toString());
    };
    return ClangFormat;
})();
exports.ClangFormat = ClangFormat;
