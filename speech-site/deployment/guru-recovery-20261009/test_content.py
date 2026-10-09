import importlib.util, unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('build_data',Path(__file__).with_name('build-data.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)

class PublicContent(unittest.TestCase):
    def test_script_form_handlers_and_css_cannot_escape_published_content(self):
        body,text,_=m.sanitize('<div style="position:fixed" onclick="bad()">Public <strong>text</strong><script>SECRET</script><form>PRIVATE<input value="PRIVATE"></form><a href="javascript:bad()">link</a></div>')
        self.assertIn('Public <strong>text</strong>',body)
        self.assertEqual(text,'Public textlink')
        for forbidden in ['SECRET','PRIVATE','javascript:','onclick','style=']:
            self.assertNotIn(forbidden,body)

    def test_original_passive_formatting_and_special_characters_survive(self):
        body,text,_=m.sanitize('<undefined>విశ్వాసం &amp; care<br><p>97\\% original dated text</p><ul><li>One</li></ul></undefined>')
        self.assertIn('విశ్వాసం & care',text)
        self.assertIn('97\\% original dated text',text)
        self.assertIn('<ul><li>One</li></ul>',body)
        self.assertNotIn('<undefined>',body)

    def test_unavailable_blob_emoji_keeps_alt_and_public_image_is_retained(self):
        body,text,media=m.sanitize('<img src="blob:http://localhost/xyz" alt="🌸"><img src="https://images.pinnacleblooms.org/Assets/PUBLISHIMAGE/Image/42_THUMB.jpeg" alt="Original" onerror="bad()">')
        self.assertEqual(text,'🌸')
        self.assertEqual(len(media),1)
        self.assertIn('referrerpolicy="no-referrer"',body)
        self.assertNotIn('onerror',body)

    def test_missing_and_unsafe_media_never_become_homepage_images(self):
        for value in [None,'','javascript:bad()','data:image/png;base64,a','blob:http://localhost/a','https://user:pass@example.test/a','https://localhost/a']:
            self.assertIsNone(m.safe_url(value,media=True),value)
        self.assertEqual(m.safe_url('/images/a.png',media=True),'https://www.pinnacleblooms.org/images/a.png')

    def test_only_one_document_h1_and_no_eager_video_embed(self):
        body,_,_=m.sanitize('<h1>Original heading</h1><iframe src="https://www.youtube.com/embed/abcdefghijk"></iframe>')
        self.assertIn('<h2>Original heading</h2>',body)
        self.assertNotIn('<iframe',body)
        self.assertIn('https://www.youtube.com/embed/abcdefghijk',body)

if __name__=='__main__':unittest.main()
