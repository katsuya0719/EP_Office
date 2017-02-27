def get_resolved_urls(url_patterns):
    url_patterns_resolved = []
    for entry in url_patterns:
        if hasattr(entry, 'url_patterns'):
            url_patterns_resolved += get_resolved_urls(
                entry.url_patterns)
        else:
            url_patterns_resolved.append(entry)
    return url_patterns_resolved