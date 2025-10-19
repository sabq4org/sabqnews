'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Image as ImageIcon,
  Link as LinkIcon,
  Youtube as YoutubeIcon,
  Undo,
  Redo,
  Smile,
  Palette,
} from 'lucide-react';
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'ابدأ الكتابة...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Youtube.configure({
        width: 640,
        height: 360,
      }),
      Color,
      TextStyle,
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
        dir: 'rtl',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('أدخل رابط الصورة:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('أدخل الرابط:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addYoutube = () => {
    const url = window.prompt('أدخل رابط فيديو YouTube:');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  const colors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF',
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
          title="عريض"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
          title="مائل"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-300' : ''}`}
          title="تحته خط"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''}`}
          title="عنوان 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
          title="عنوان 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''}`}
          title="عنوان 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
          title="قائمة نقطية"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''}`}
          title="قائمة مرقمة"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Alignment */}
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''}`}
          title="محاذاة لليمين"
        >
          <AlignRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''}`}
          title="محاذاة للوسط"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''}`}
          title="محاذاة لليسار"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Other */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-300' : ''}`}
          title="اقتباس"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-300' : ''}`}
          title="كود"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Media */}
        <button
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200"
          title="إضافة صورة"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          onClick={addLink}
          className="p-2 rounded hover:bg-gray-200"
          title="إضافة رابط"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          onClick={addYoutube}
          className="p-2 rounded hover:bg-gray-200"
          title="إضافة فيديو YouTube"
        >
          <YoutubeIcon className="w-4 h-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Emoji */}
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded hover:bg-gray-200"
            title="إضافة إيموجي"
          >
            <Smile className="w-4 h-4" />
          </button>
          {showEmojiPicker && (
            <div className="absolute top-full left-0 mt-1 z-50">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  editor.chain().focus().insertContent(emojiData.emoji).run();
                  setShowEmojiPicker(false);
                }}
                searchPlaceholder="بحث..."
                skinTonesDisabled
              />
            </div>
          )}
        </div>

        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 rounded hover:bg-gray-200"
            title="لون النص"
          >
            <Palette className="w-4 h-4" />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-300 rounded-lg p-2 shadow-lg">
              <div className="grid grid-cols-4 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setColor(color)}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-px bg-gray-300 mx-1" />

        {/* Undo/Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="تراجع"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="إعادة"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}

