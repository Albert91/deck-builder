import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { CardLimitDisplay } from "./cards/CardLimitDisplay";
import type { DeckViewModel, CardLimitInfo, ExportStatus } from "@/types";

interface DeckCardsHeaderProps {
  deck: DeckViewModel;
  cardLimitInfo: CardLimitInfo;
  exportStatus: ExportStatus;
  onExport: () => void;
  onShare: () => void;
}

export function DeckCardsHeader({
  deck,
  cardLimitInfo,
  exportStatus,
  onExport,
  onShare
}: DeckCardsHeaderProps) {
  return (
    <Card className="bg-card">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{deck.name}</h1>
          <CardLimitDisplay 
            currentCount={cardLimitInfo.totalCards} 
            maxLimit={cardLimitInfo.cardLimit} 
          />
        </div>
        <div className="flex items-center gap-2">
          <Tooltip>
            <Tooltip.Trigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onExport}
                disabled={exportStatus.isExporting || cardLimitInfo.totalCards === 0}
              >
                {exportStatus.isExporting ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Eksportowanie...
                  </>
                ) : (
                  <>
                    <svg 
                      className="mr-2 h-4 w-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                    Eksportuj do PDF
                  </>
                )}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              {cardLimitInfo.totalCards === 0 
                ? "Nie można eksportować pustej talii" 
                : "Eksportuj karty do pliku PDF"}
            </Tooltip.Content>
          </Tooltip>

          <Tooltip>
            <Tooltip.Trigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onShare}
                disabled={cardLimitInfo.totalCards === 0}
              >
                <svg 
                  className="mr-2 h-4 w-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
                  />
                </svg>
                Udostępnij
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              {cardLimitInfo.totalCards === 0 
                ? "Nie można udostępnić pustej talii" 
                : "Udostępnij talię innym"}
            </Tooltip.Content>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
} 