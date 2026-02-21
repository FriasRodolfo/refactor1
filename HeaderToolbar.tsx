import { BookOpen, ChevronDown, PlayCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import GerenteChatDialog from "@/components/GerenteChatDialog";

export type GuideMode =
  | "GENERAL"
  | "RESUMEN"
  | "RENDIMIENTO"
  | "ANALISIS"
  | "INVENTARIO"
  | "KPIS"
  | "ALERTAS"
  | "GERENTE";

interface HeaderToolbarProps {
  chatOpen: boolean;
  setChatOpen: (value: boolean) => void;
  chatHelpOpen: boolean;
  setChatHelpOpen: (value: boolean) => void;
  showGuideMenu: boolean;
  setShowGuideMenu: (value: boolean) => void;
  showVideoMenu: boolean;
  setShowVideoMenu: (value: boolean) => void;
  onStartGuide: (mode: GuideMode) => void;
}

export default function HeaderToolbar({
  chatOpen,
  setChatOpen,
  chatHelpOpen,
  setChatHelpOpen,
  showGuideMenu,
  setShowGuideMenu,
  showVideoMenu,
  setShowVideoMenu,
  onStartGuide,
}: HeaderToolbarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-orange-600">Panel del Gerente</h1>

        <div data-guide="btn-chat-gerente">
          <GerenteChatDialog
            externalOpen={chatOpen}
            onOpenChange={setChatOpen}
            externalShowHelp={chatHelpOpen}
            onHelpChange={setChatHelpOpen}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative inline-block text-left">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGuideMenu(!showGuideMenu)}
            className="flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Guía Interactiva
            <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
          </Button>

          {showGuideMenu && (
            <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-slate-900 z-50 p-1 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
              <div className="py-1">
                <button
                  onClick={() => onStartGuide("RESUMEN")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  📊 Resumen Mensual
                </button>
                <button
                  onClick={() => onStartGuide("RENDIMIENTO")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  📈 Rendimiento
                </button>
                <button
                  onClick={() => onStartGuide("ANALISIS")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  👥 Análisis Clientes
                </button>
                <button
                  onClick={() => onStartGuide("INVENTARIO")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  📦 Inventario
                </button>
                <button
                  onClick={() => onStartGuide("KPIS")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  💰 Datos Financieros
                </button>
                <button
                  onClick={() => onStartGuide("ALERTAS")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded border-t mt-1"
                >
                  🚨 Alertas y Sugerencias
                </button>
                <button
                  onClick={() => onStartGuide("GERENTE")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded border-t mt-1"
                >
                  🧑‍💼 Gerente Crov
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative inline-block text-left">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVideoMenu(!showVideoMenu)}
            className="flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            Guía Rápida
            <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
          </Button>

          {showVideoMenu && (
            <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-slate-900 z-50 p-1 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200">
              <div className="py-1">
                <button
                  onClick={() =>
                    window.open(
                      "https://www.youtube.com/watch?v=RlstVZSiRM4&list=PLQiB7q2hSscFQdcSdoDEs0xFSdPZjBIT-&index=12",
                      "_blank",
                    )
                  }
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  <PlayCircle className="w-3 h-3 inline mr-2 text-red-500" /> Ver
                  Video Tutorial
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
