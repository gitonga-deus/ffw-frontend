"use client";

import { useEditor, EditorContent } from"@tiptap/react";
import StarterKit from"@tiptap/starter-kit";
import TextAlign from"@tiptap/extension-text-align";
import Underline from"@tiptap/extension-underline";
import Link from"@tiptap/extension-link";
import Image from"@tiptap/extension-image";
import { Table } from"@tiptap/extension-table";
import TableRow from"@tiptap/extension-table-row";
import TableCell from"@tiptap/extension-table-cell";
import TableHeader from"@tiptap/extension-table-header";
import TaskList from"@tiptap/extension-task-list";
import TaskItem from"@tiptap/extension-task-item";
import Highlight from"@tiptap/extension-highlight";
import CodeBlockLowlight from"@tiptap/extension-code-block-lowlight";
import { TextStyle } from"@tiptap/extension-text-style";
import Color from"@tiptap/extension-color";
import { createLowlight, common } from"lowlight";
import { Button } from"@/components/ui/button";
import { Separator } from"@/components/ui/separator";
import {
	Bold,
	Italic,
	Underline as UnderlineIcon,
	Strikethrough,
	Code,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	Quote,
	Undo,
	Redo,
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
	Link as LinkIcon,
	Image as ImageIcon,
	Table as TableIcon,
	CheckSquare,
	Highlighter,
	Palette,
} from"lucide-react";
import { useCallback } from"react";

interface TiptapEditorProps {
	content: string;
	onChange: (content: string) => void;
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
	// Create lowlight instance with common languages
	const lowlight = createLowlight(common);

	const editor = useEditor({
		immediatelyRender: false,
		extensions: [
			StarterKit.configure({
				codeBlock: false, // We'll use CodeBlockLowlight instead
			}),
			TextAlign.configure({
				types: ["heading","paragraph"],
			}),
			Underline,
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class:"text-primary underline",
				},
			}),
			Image.configure({
				HTMLAttributes: {
					class:"max-w-full h-auto rounded-lg",
				},
			}),
			Table.configure({
				resizable: true,
				HTMLAttributes: {
					class:"border-collapse table-auto w-full",
				},
			}),
			TableRow,
			TableHeader,
			TableCell,
			TaskList,
			TaskItem.configure({
				nested: true,
			}),
			Highlight.configure({
				multicolor: true,
			}),
			CodeBlockLowlight.configure({
				lowlight,
				HTMLAttributes: {
					class:"bg-muted p-4 rounded-lg font-mono text-sm",
				},
			}),
			TextStyle,
			Color,
		],
		content,
		editorProps: {
			attributes: {
				class:"prose prose-slate dark:prose-invert max-w-none focus:outline-none min-h-[300px] p-4 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-ul:list-disc prose-ol:list-decimal prose-li:my-1 prose-p:my-3",
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
	});

	const setLink = useCallback(() => {
		if (!editor) return;

		const previousUrl = editor.getAttributes("link").href;
		const url = window.prompt("URL", previousUrl);

		if (url === null) return;

		if (url ==="") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}

		editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
	}, [editor]);

	const addImage = useCallback(() => {
		if (!editor) return;

		const url = window.prompt("Image URL");

		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	}, [editor]);

	const addTable = useCallback(() => {
		if (!editor) return;

		editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
	}, [editor]);

	if (!editor) {
		return null;
	}

	return (
		<div className="border overflow-hidden">
			{/* Toolbar */}
			<div className="bg-muted p-2 border-b flex flex-wrap gap-1">
				{/* Text Formatting */}
				<Button
					type="button"
					variant={editor.isActive("bold") ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().toggleBold().run()}
					title="Bold"
				>
					<Bold className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant={editor.isActive("italic") ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					title="Italic"
				>
					<Italic className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant={editor.isActive("underline") ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					title="Underline"
				>
					<UnderlineIcon className="h-4 w-4" />
				</Button>
				{/* <Button
					type="button"
					variant={editor.isActive("strike") ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().toggleStrike().run()}
					title="Strikethrough"
				>
					<Strikethrough className="h-4 w-4" />
				</Button> */}
				{/* <Button
					type="button"
					variant={editor.isActive("code") ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().toggleCode().run()}
					title="Inline Code"
				>
					<Code className="h-4 w-4" />
				</Button> */}

				<Separator orientation="vertical" className="h-8" />

				{/* Headings */}
				<Button
					type="button"
					variant={editor.isActive("heading", { level: 1 }) ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
					title="Heading 1"
				>
					<Heading1 className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant={editor.isActive("heading", { level: 2 }) ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					title="Heading 2"
				>
					<Heading2 className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant={editor.isActive("heading", { level: 3 }) ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
					title="Heading 3"
				>
					<Heading3 className="h-4 w-4" />
				</Button>

				<Separator orientation="vertical" className="h-8" />

				{/* Lists */}
				<Button
					type="button"
					variant={editor.isActive("bulletList") ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					title="Bullet List"
				>
					<List className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant={editor.isActive("orderedList") ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					title="Numbered List"
				>
					<ListOrdered className="h-4 w-4" />
				</Button>
				{/* <Button
					type="button"
					variant={editor.isActive("taskList") ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().toggleTaskList().run()}
					title="Task List"
				>
					<CheckSquare className="h-4 w-4" />
				</Button> */}

				<Separator orientation="vertical" className="h-8" />

				{/* Alignment */}
				<Button
					type="button"
					variant={editor.isActive({ textAlign:"left" }) ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().setTextAlign("left").run()}
					title="Align Left"
				>
					<AlignLeft className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant={editor.isActive({ textAlign:"center" }) ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().setTextAlign("center").run()}
					title="Align Center"
				>
					<AlignCenter className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant={editor.isActive({ textAlign:"right" }) ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().setTextAlign("right").run()}
					title="Align Right"
				>
					<AlignRight className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant={editor.isActive({ textAlign:"justify" }) ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().setTextAlign("justify").run()}
					title="Justify"
				>
					<AlignJustify className="h-4 w-4" />
				</Button>

				<Separator orientation="vertical" className="h-8" />

				{/* Other */}
				<Button
					type="button"
					variant={editor.isActive("blockquote") ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					title="Quote"
				>
					<Quote className="h-4 w-4" />
				</Button>
				{/* <Button
					type="button"
					variant={editor.isActive("highlight") ?"default" :"ghost"}
					size="sm"
					onClick={() => editor.chain().focus().toggleHighlight().run()}
					title="Highlight"
				>
					<Highlighter className="h-4 w-4" />
				</Button> */}
				<Button
					type="button"
					variant={editor.isActive("link") ?"default" :"ghost"}
					size="sm"
					onClick={setLink}
					title="Add Link"
				>
					<LinkIcon className="h-4 w-4" />
				</Button>
				<Button type="button" variant="ghost" size="sm" onClick={addImage} title="Add Image">
					<ImageIcon className="h-4 w-4" />
				</Button>
				<Button type="button" variant="ghost" size="sm" onClick={addTable} title="Add Table">
					<TableIcon className="h-4 w-4" />
				</Button>

				<Separator orientation="vertical" className="h-8" />

				{/* Undo/Redo */}
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().undo()}
					title="Undo"
				>
					<Undo className="h-4 w-4" />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().redo()}
					title="Redo"
				>
					<Redo className="h-4 w-4" />
				</Button>
			</div>

			{/* Editor Content */}
			<EditorContent editor={editor} className="bg-background" />
		</div>
	);
}
