function extractHashtags(desc) {
    // Biểu thức chính quy để tìm các hashtag
    const hashtagRegex = /#\w+/g;
  
    // Tìm tất cả các hashtag trong văn bản
    const hashtags = desc.match(hashtagRegex) || [];
  
    // Loại bỏ các hashtag khỏi văn bản
    const text = desc.replace(hashtagRegex, '').trim();
  
    return {
      text,
      hashtags
    };
  }

module.exports = { extractHashtags };