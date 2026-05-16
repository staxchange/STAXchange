export interface Signal {
	signal_id: string;
	created_at: number;
	signal_type: string;
	payload: unknown;
	metadata?: {
		source?: string;
		confidence?: number;
		tags?: string[];
	};
}
