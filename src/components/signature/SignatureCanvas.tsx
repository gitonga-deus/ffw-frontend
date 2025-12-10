"use client";

import { useRef, useState, useEffect } from"react";
import { Button } from"@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from"@/components/ui/card";
import { ButtonGroup } from"@/components/ui/button-group";
import { Pen, Eraser, RotateCcw, Check } from"lucide-react";

interface SignatureCanvasProps {
	onSave: (signatureBlob: Blob) => void;
	isSubmitting?: boolean;
}

export function SignatureCanvas({ onSave, isSubmitting }: SignatureCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [hasDrawn, setHasDrawn] = useState(false);
	const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
	const [history, setHistory] = useState<ImageData[]>([]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas size
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width * window.devicePixelRatio;
		canvas.height = rect.height * window.devicePixelRatio;
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

		// Set drawing styles
		ctx.strokeStyle ="#000000";
		ctx.lineWidth = 2;
		ctx.lineCap ="round";
		ctx.lineJoin ="round";

		// Fill with white background
		ctx.fillStyle ="#ffffff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		setContext(ctx);

		// Save initial state
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		setHistory([imageData]);
	}, []);

	const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (!context || !canvasRef.current) return;

		setIsDrawing(true);
		const rect = canvasRef.current.getBoundingClientRect();

		let x, y;
		if ('touches' in e) {
			x = e.touches[0].clientX - rect.left;
			y = e.touches[0].clientY - rect.top;
		} else {
			x = e.clientX - rect.left;
			y = e.clientY - rect.top;
		}

		context.beginPath();
		context.moveTo(x, y);
	};

	const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (!isDrawing || !context || !canvasRef.current) return;

		const rect = canvasRef.current.getBoundingClientRect();

		let x, y;
		if ('touches' in e) {
			e.preventDefault();
			x = e.touches[0].clientX - rect.left;
			y = e.touches[0].clientY - rect.top;
		} else {
			x = e.clientX - rect.left;
			y = e.clientY - rect.top;
		}

		context.lineTo(x, y);
		context.stroke();
		setHasDrawn(true);
	};

	const stopDrawing = () => {
		if (!isDrawing || !context || !canvasRef.current) return;

		setIsDrawing(false);
		context.closePath();

		// Save state to history
		const imageData = context.getImageData(
			0,
			0,
			canvasRef.current.width,
			canvasRef.current.height
		);
		setHistory((prev) => [...prev, imageData]);
	};

	const clearCanvas = () => {
		if (!context || !canvasRef.current) return;

		context.fillStyle ="#ffffff";
		context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
		setHasDrawn(false);
		setHistory([]);
	};

	const undo = () => {
		if (!context || !canvasRef.current || history.length <= 1) return;

		const newHistory = [...history];
		newHistory.pop(); // Remove current state
		const previousState = newHistory[newHistory.length - 1];

		if (previousState) {
			context.putImageData(previousState, 0, 0);
			setHistory(newHistory);
			setHasDrawn(newHistory.length > 1);
		}
	};

	const saveSignature = () => {
		if (!canvasRef.current || !hasDrawn) return;

		canvasRef.current.toBlob((blob) => {
			if (blob) {
				onSave(blob);
			}
		},"image/png");
	};

	return (
		<Card className="rounded-sm shadow-none">
			<CardHeader>
				<CardTitle>Digital Signature</CardTitle>
				<CardDescription>
					Please draw your signature in the box below using your mouse or touch screen
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden bg-white">
					<canvas
						ref={canvasRef}
						onMouseDown={startDrawing}
						onMouseMove={draw}
						onMouseUp={stopDrawing}
						onMouseLeave={stopDrawing}
						onTouchStart={startDrawing}
						onTouchMove={draw}
						onTouchEnd={stopDrawing}
						className="w-full h-64 cursor-crosshair touch-none"
						style={{ touchAction:"none" }}
					/>
				</div>

				<div className="flex flex-wrap gap-4 items-center">
					<ButtonGroup>
						<Button
							type="button"
							variant="outline"
							className="h-10 px-4!"
							onClick={undo}
							disabled={history.length <= 1 || isSubmitting}
						>
							<RotateCcw className="mr-2 h-4 w-4" />
							Undo
						</Button>
						<Button
							type="button"
							variant="outline"
							className="h-10 px-4!"
							onClick={clearCanvas}
							disabled={!hasDrawn || isSubmitting}
						>
							<Eraser className="mr-2 h-4 w-4" />
							Clear
						</Button>
					</ButtonGroup>
					<Button
						type="button"
						onClick={saveSignature}
						disabled={!hasDrawn || isSubmitting}
						className="ml-auto px-4! h-10 bg-[#049ad1] hover:bg-[#049ad1]/90 rounded-sm"
					>
						{isSubmitting ? (
							<>
								<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
								Submitting...
							</>
						) : (
							<>
								<Check className="mr-2 h-4 w-4" />
								Submit Signature
							</>
						)}
					</Button>
				</div>

				<p className="text-xs text-muted-foreground">
					By submitting your signature, you confirm your commitment to complete this
					course and agree to the terms and conditions.
				</p>
			</CardContent>
		</Card>
	);
}
