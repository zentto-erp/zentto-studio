export interface ShareConfig {
  url: string;
  title?: string;
  text?: string;
  image?: string;
  hashtags?: string;
  via?: string;
}

export function getShareUrl(network: string, config: ShareConfig): string {
  const { url, title = '', text = '', image = '', hashtags = '', via = '' } = config;
  const enc = encodeURIComponent;

  switch (network.toLowerCase()) {
    case 'facebook': return `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
    case 'twitter':
    case 'x': return `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(text || title)}${hashtags ? '&hashtags=' + enc(hashtags) : ''}${via ? '&via=' + enc(via) : ''}`;
    case 'linkedin': return `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;
    case 'whatsapp': return `https://wa.me/?text=${enc((text || title) + ' ' + url)}`;
    case 'telegram': return `https://t.me/share/url?url=${enc(url)}&text=${enc(text || title)}`;
    case 'pinterest': return `https://pinterest.com/pin/create/button/?url=${enc(url)}&media=${enc(image)}&description=${enc(text || title)}`;
    case 'reddit': return `https://reddit.com/submit?url=${enc(url)}&title=${enc(title)}`;
    case 'email': return `mailto:?subject=${enc(title)}&body=${enc((text || title) + '\n\n' + url)}`;
    case 'threads': return `https://www.threads.net/intent/post?text=${enc((text || title) + ' ' + url)}`;
    case 'bluesky': return `https://bsky.app/intent/compose?text=${enc((text || title) + ' ' + url)}`;
    case 'mastodon': return `https://mastodon.social/share?text=${enc((text || title) + ' ' + url)}`;
    case 'tumblr': return `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${enc(url)}&title=${enc(title)}&caption=${enc(text)}`;
    case 'pocket': return `https://getpocket.com/save?url=${enc(url)}&title=${enc(title)}`;
    case 'hackernews': return `https://news.ycombinator.com/submitlink?u=${enc(url)}&t=${enc(title)}`;
    case 'flipboard': return `https://share.flipboard.com/bookmarklet/popout?v=2&url=${enc(url)}&title=${enc(title)}`;
    case 'line': return `https://social-plugins.line.me/lineit/share?url=${enc(url)}`;
    case 'viber': return `viber://forward?text=${enc((text || title) + ' ' + url)}`;
    default: return '';
  }
}

export function getSupportedShareNetworks(): string[] {
  return ['facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram', 'pinterest', 'reddit', 'email', 'threads', 'bluesky', 'mastodon', 'tumblr', 'pocket', 'hackernews', 'flipboard', 'line', 'viber'];
}

export function canNativeShare(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

export async function nativeShare(config: ShareConfig): Promise<boolean> {
  if (!canNativeShare()) return false;
  try {
    await navigator.share({ title: config.title, text: config.text || config.title, url: config.url });
    return true;
  } catch { return false; }
}
