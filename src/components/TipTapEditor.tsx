"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3 } from 'lucide-react'
import React from 'react';

export default function TipTapEditor({ content, onChange }: { content?: string, onChange?: (html: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: content || '<p>Start writing your masterpiece...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg md:prose-xl max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-headings:text-black prose-a:text-crimson prose-blockquote:border-crimson prose-blockquote:bg-crimson/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl focus:outline-none min-h-[500px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    immediatelyRender: false,
  })

  if (!editor) {
    return <div className="min-h-[500px] flex items-center justify-center text-slate-400">Loading editor...</div>
  }

  return (
    <div className="border border-crimson/10 rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col">
      {/* Toolbar */}
      <div className="bg-slate-50 border-b border-crimson/10 p-2 flex items-center space-x-1 flex-wrap sticky top-0 z-10">
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive('bold')}
          icon={<Bold size={16} />}
          title="Bold"
        />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive('italic')}
          icon={<Italic size={16} />}
          title="Italic"
        />
        <div className="w-px h-6 bg-slate-200 mx-2"></div>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive('heading', { level: 2 })}
          icon={<Heading2 size={16} />}
          title="Heading 2"
        />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          isActive={editor.isActive('heading', { level: 3 })}
          icon={<Heading3 size={16} />}
          title="Heading 3"
        />
        <div className="w-px h-6 bg-slate-200 mx-2"></div>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          isActive={editor.isActive('bulletList')}
          icon={<List size={16} />}
          title="Bullet List"
        />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          isActive={editor.isActive('orderedList')}
          icon={<ListOrdered size={16} />}
          title="Ordered List"
        />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          isActive={editor.isActive('blockquote')}
          icon={<Quote size={16} />}
          title="Quote"
        />
      </div>

      {/* Canvas */}
      <div className="p-8 md:p-12 overflow-y-auto max-h-[70vh]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

function MenuButton({ onClick, isActive, icon, title }: { onClick: () => void, isActive: boolean, icon: React.ReactNode, title: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
        isActive 
          ? 'bg-crimson/10 text-crimson font-medium' 
          : 'text-slate-500 hover:bg-slate-200 hover:text-slate-800'
      }`}
    >
      {icon}
    </button>
  )
}
