export current_path=$(cd `dirname $0`; pwd)
echo $current_path
export plugin_path=~/.atom/packages/atom-format/
echo $plugin_path

rm -rf $plugin_path
cp -r $current_path $plugin_path
atom $current_path
