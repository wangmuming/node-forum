import marked from 'marked';
import Highlight from 'highlight.js';
import xss from 'xss';

export function redirectURL(url) {
  location = url;
}

// xss 默认将语法高亮去掉了，使用白名单解决
marked.setOptions({
  highlight: function (code) {
    return Highlight.highlightAuto(code).value;
  }
});

const xssOptions = {
  whiteList: Object.assign({}, xss.whiteList),
};
xssOptions.whiteList.code = ['class'];
xssOptions.whiteList.span = ['class'];
const myxss = new xss.FilterXSS(xssOptions);

export function renderMarkdown(text) {
  return myxss.process(marked(text));
}
