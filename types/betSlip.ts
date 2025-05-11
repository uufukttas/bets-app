import { CartItem } from "@/store/slices/cartSlice";

export interface IBetSlipProps {
    onClose?: () => void;
}

export interface IBetResultProps {
    success: boolean;
    message: string;
}

export interface IBetSlipConfirmationProps {
    stake: string;
    formattedTotalOdds: string;
    potentialWin: string;
    selections: CartItem[];
    handleCancelConfirmation: () => void;
    handlePlaceBet: () => void;
}

export interface IBetSlipEmptyProps {
    onClose?: () => void;
}

export interface IBetSelectedProps {
    selections: CartItem[];
    handleRemoveBet: (id: string) => void;
}

export interface IBetButtonsProps {
    isPlacingBet: boolean;
    stake: string;
    handleShowConfirmation: () => void;
}

export interface IBetStakeProps {
    stake: string;
    handleStakeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isPlacingBet: boolean;
    potentialWin: string;
}

export interface IBetSlipHeaderProps {
    cartCount: number;
    onClose?: () => void;
}

export interface IBetContentProps {
    betResult: IBetResultProps | null;
    formattedTotalOdds: string;
    setShowConfirmation: (show: boolean) => void;
    onClose?: () => void;
    stake: string;
    setStake: (stake: string) => void;
    isPlacingBet: boolean;
    potentialWin: string;
}

export interface IBetResultComponentProps {
    betResult: IBetResultProps;
}

export interface IBetSlipSummaryProps {
    formattedTotalOdds: string;
}
