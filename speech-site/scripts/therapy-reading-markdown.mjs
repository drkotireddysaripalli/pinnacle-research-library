// This is public generated reading text, never a private imported payload.
export function updateReadingMarkdown(prior,heading,markdown) {
  const marker='\n\n## '+heading;
  return prior.replaceAll('\r\n','\n').split(marker)[0].trimEnd()+markdown;
}
