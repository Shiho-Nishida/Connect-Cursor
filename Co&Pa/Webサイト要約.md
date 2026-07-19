


# 指定したURLのWebページの内容を取得し、その要点を3つにまとめさせる 


curl -s https://www.example.com/news/latest | \ gemini -p "この記事で最も重要なポイントは何ですか？3つに絞って教えてください。"