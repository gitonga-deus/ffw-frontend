"use client";

import { Input } from"@/components/ui/input";
import { Label } from"@/components/ui/label";

interface VideoContentFormProps {
	formData: any;
	setFormData: (data: any) => void;
}

export function VideoContentForm({ formData, setFormData }: VideoContentFormProps) {
	return (
		<div className="space-y-4 border p-4">
			<h4 className="font-medium">Video Settings</h4>

			<div className="grid gap-2">
				<Label htmlFor="vimeo_video_id">Vimeo Video ID *</Label>
				<Input
					id="vimeo_video_id"
					value={formData.vimeo_video_id}
					onChange={(e) => setFormData({ ...formData, vimeo_video_id: e.target.value })}
					placeholder="e.g., 123456789"
					className="h-10"
					required
				/>
				<p className="text-xs text-muted-foreground">
					The numeric ID from your Vimeo video URL
				</p>
			</div>

			<div className="grid gap-2">
				<Label htmlFor="video_duration">Duration (seconds)</Label>
				<Input
					id="video_duration"
					type="number"
					min="0"
					className="h-10"
					value={formData.video_duration}
					onChange={(e) =>
						setFormData({ ...formData, video_duration: parseInt(e.target.value) || 0 })
					}
					placeholder="e.g., 300"
				/>
				<p className="text-xs text-muted-foreground">
					Video duration in seconds (optional)
				</p>
			</div>
		</div>
	);
}
