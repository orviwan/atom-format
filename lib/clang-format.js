var fs = require('fs');
var child_process_1 = require('child_process');
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
            var onSave = editor.getBuffer().onWillSave(function () {
                var autoSave = atom.config.get('atom-format.autoSave');
                var extension = (editor.getPath().match(/\..+?$/) || [])[0];
                if (autoSave.indexOf(extension) >= 0)
                    _this._format(editor);
            });
            var onDestroy = editor.getBuffer().onDidDestroy(function () {
                onSave.dispose();
                onDestroy.dispose();
                _this.subscriptions.remove(onDestroy);
                _this.subscriptions.remove(onSave);
            });
            _this.subscriptions.add(onSave);
            _this.subscriptions.add(onDestroy);
        }));
    }
    ClangFormat.prototype.destroy = function () {
        this.subscriptions.dispose();
    };
    ClangFormat.prototype._format = function (editor) {
        var command = "" + atom.config.get('atom-format.executable');
        if (!fs.existsSync(command)) {
            atom.notifications.addError("Doesn't bundle the clang-format executable by your setting path(" + command + "). Consider setting it with your correct path instead.");
            return;
        }
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
