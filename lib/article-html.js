import sanitizeHtml from 'sanitize-html';
import { marked } from 'marked';

const allowedTags = [
  'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u',
  'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'figure', 'figcaption',
  'hr', 'span', 'div', 'code', 'pre', 'del'
];

const sanitizeOptions = {
  allowedTags,
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    figure: ['class'],
    div: ['class'],
    span: ['class'],
    code: ['class'],
    pre: ['class']
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowProtocolRelative: false,
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', {
      rel: 'noopener noreferrer',
      target: '_blank'
    })
  }
};

export function sanitizeArticleHtml(content = '') {
  const source = String(content ?? '').trim();
  if (!source) return '';

  // Articles in the database currently use two formats: HTML and Markdown.
  // Detect HTML first; otherwise convert Markdown to HTML before sanitizing.
  const isHtml = /<\/?[a-z][^>]*>/i.test(source);
  const html = isHtml
    ? source
    : marked.parse(source, { async: false, gfm: true, breaks: false });

  return sanitizeHtml(html, sanitizeOptions);
}
