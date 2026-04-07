import { useState } from 'react';
import { Search, Smartphone, MapPin, Tag, AlertCircle, Info, Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModelData {
  isValid: boolean;
  status?: string;
  region?: string;
  error?: string;
}

const REGION_CODES = [
  { code: "A", country: "Canadá" },
  { code: "AB", country: "Egipto, Jordania, Arabia Saudita, EAU" },
  { code: "AE", country: "EAU, Bahréin, Kuwait, Qatar, Arabia Saudita" },
  { code: "AH", country: "Bahréin, Kuwait" },
  { code: "AM", country: "Estados Unidos (Ensamblado en EE.UU.)" },
  { code: "B", country: "Irlanda, Reino Unido" },
  { code: "BG", country: "Bulgaria" },
  { code: "BR", country: "Brasil" },
  { code: "BT", country: "Reino Unido" },
  { code: "BZ", country: "Brasil" },
  { code: "C", country: "Canadá" },
  { code: "CH", country: "China" },
  { code: "CI", country: "Paraguay" },
  { code: "CM", country: "Hungría, Croacia" },
  { code: "CR", country: "Croacia" },
  { code: "CS", country: "Eslovaquia, República Checa" },
  { code: "CZ", country: "República Checa" },
  { code: "D", country: "Alemania" },
  { code: "DN", country: "Austria, Alemania, Países Bajos" },
  { code: "E", country: "México" },
  { code: "EE", country: "Estonia" },
  { code: "EL", country: "Estonia, Letonia" },
  { code: "ER", country: "Irlanda" },
  { code: "F", country: "Francia" },
  { code: "FB", country: "Francia, Luxemburgo" },
  { code: "FD", country: "Austria, Liechtenstein, Suiza" },
  { code: "FN", country: "Indonesia" },
  { code: "FS", country: "Finlandia" },
  { code: "GB", country: "Grecia" },
  { code: "GH", country: "Hungría" },
  { code: "GP", country: "Portugal" },
  { code: "GR", country: "Grecia" },
  { code: "HB", country: "Israel" },
  { code: "HC", country: "Hungría, Bulgaria" },
  { code: "HN", country: "India" },
  { code: "ID", country: "Indonesia" },
  { code: "IP", country: "Italia" },
  { code: "J", country: "Japón" },
  { code: "K", country: "Suecia" },
  { code: "KH", country: "Corea del Sur, China" },
  { code: "KN", country: "Noruega" },
  { code: "KS", country: "Finlandia, Suecia" },
  { code: "LA", country: "Colombia, Ecuador, El Salvador, Guatemala, Honduras, Perú" },
  { code: "LE", country: "Argentina" },
  { code: "LL", country: "Estados Unidos" },
  { code: "LP", country: "Polonia" },
  { code: "LT", country: "Lituania" },
  { code: "LV", country: "Letonia" },
  { code: "LZ", country: "Chile, Paraguay, Uruguay" },
  { code: "M", country: "Suecia" },
  { code: "MD", country: "Suecia" },
  { code: "MG", country: "Hungría" },
  { code: "MM", country: "Montenegro, Albania, Macedonia" },
  { code: "MY", country: "Malasia" },
  { code: "ND", country: "Países Bajos" },
  { code: "NF", country: "Bélgica, Francia, Luxemburgo, Portugal" },
  { code: "PA", country: "Indonesia" },
  { code: "PK", country: "Polonia, Finlandia" },
  { code: "PL", country: "Polonia" },
  { code: "PM", country: "Polonia" },
  { code: "PN", country: "Polonia" },
  { code: "PO", country: "Portugal" },
  { code: "PP", country: "Filipinas" },
  { code: "PY", country: "España" },
  { code: "QB", country: "Rusia" },
  { code: "QL", country: "España, Italia, Portugal" },
  { code: "QN", country: "Suecia, Dinamarca, Islandia, Noruega" },
  { code: "RK", country: "Kazajistán" },
  { code: "RM", country: "Rusia, Kazajistán" },
  { code: "RO", country: "Rumania" },
  { code: "RP", country: "Rusia" },
  { code: "RS", country: "Rusia" },
  { code: "RU", country: "Rusia" },
  { code: "SA", country: "Arabia Saudita" },
  { code: "SE", country: "Serbia" },
  { code: "SL", country: "Eslovaquia" },
  { code: "SO", country: "Sudáfrica" },
  { code: "SU", country: "Ucrania" },
  { code: "T", country: "Italia" },
  { code: "TA", country: "Taiwán" },
  { code: "TH", country: "Tailandia" },
  { code: "TU", country: "Turquía" },
  { code: "TY", country: "Italia" },
  { code: "UA", country: "Ucrania" },
  { code: "VC", country: "Canadá" },
  { code: "VN", country: "Vietnam" },
  { code: "X", country: "Australia, Nueva Zelanda" },
  { code: "Y", country: "España" },
  { code: "ZA", country: "Singapur" },
  { code: "ZD", country: "Luxemburgo, Austria, Bélgica, Mónaco, Alemania, Francia, Países Bajos, Suiza" },
  { code: "ZG", country: "Dinamarca" },
  { code: "ZO", country: "Reino Unido" },
  { code: "ZP", country: "Hong Kong, Macao" },
  { code: "ZQ", country: "Jamaica" }
];

const STATUS_CODES = [
  { code: "M", description: "Dispositivo Nuevo" },
  { code: "F", description: "Dispositivo Reacondicionado (Refurbished)" },
  { code: "N", description: "Dispositivo de Reemplazo" },
  { code: "P", description: "Dispositivo Personalizado (con grabado)" }
];

export default function App() {
  const [modelNumber, setModelNumber] = useState('');
  const [data, setData] = useState<ModelData | null>(null);
  const [error, setError] = useState('');
  const [showRegions, setShowRegions] = useState(false);
  const [showPrefixes, setShowPrefixes] = useState(false);

  const handleDecode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelNumber.trim()) return;

    setError('');
    setData(null);

    const cleanModel = modelNumber.trim().toUpperCase();

    // Basic validation
    if (!/^[MFNP][A-Z0-9]+(\/[A-Z0-9]+)?$/.test(cleanModel)) {
      setData({
        isValid: false,
        error: "El formato no parece un número de modelo de Apple válido. Debe empezar por M, F, N o P."
      });
      return;
    }

    const firstLetter = cleanModel.charAt(0);
    const statusObj = STATUS_CODES.find(s => s.code === firstLetter);
    const status = statusObj ? statusObj.description : "Desconocido";

    let region = "Desconocida";
    
    const slashIndex = cleanModel.indexOf('/');
    let beforeSlash = cleanModel;
    if (slashIndex !== -1) {
      beforeSlash = cleanModel.substring(0, slashIndex);
    }

    // Sort REGION_CODES by length descending to match longer codes first
    const sortedRegions = [...REGION_CODES].sort((a, b) => b.code.length - a.code.length);
    
    for (const r of sortedRegions) {
      if (beforeSlash.endsWith(r.code)) {
        region = r.country;
        break;
      }
    }

    setData({
      isValid: true,
      status,
      region
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-200">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black text-white mb-6 shadow-lg">
            <Smartphone className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
            Decodificador Apple
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Descubre si tu dispositivo es nuevo, reacondicionado o de reemplazo, y conoce su región de origen introduciendo el número de modelo.
          </p>
        </div>

        <form onSubmit={handleDecode} className="relative max-w-xl mx-auto mb-12">
          <div className="relative flex items-center">
            <Search className="absolute left-6 text-gray-400 w-6 h-6" />
            <input
              type="text"
              value={modelNumber}
              onChange={(e) => setModelNumber(e.target.value.toUpperCase())}
              placeholder="Ej. MXVU2J/A"
              className="w-full pl-16 pr-36 py-5 text-xl font-medium bg-white border-2 border-gray-200 rounded-full focus:outline-none focus:border-black focus:ring-4 focus:ring-gray-100 transition-all uppercase placeholder:normal-case shadow-sm"
            />
            <button
              type="submit"
              disabled={!modelNumber.trim()}
              className="absolute right-3 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              Decodificar
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4 text-center">
            Puedes encontrar el número de modelo en Ajustes &gt; General &gt; Información.
          </p>
        </form>

        {/* Results */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto p-4 bg-red-50 text-red-700 rounded-2xl flex items-start gap-3 mb-12"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}

          {data && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto space-y-6 mb-12"
            >
              {!data.isValid ? (
                <div className="p-6 bg-amber-50 text-amber-800 rounded-3xl flex items-start gap-4 border border-amber-100">
                  <AlertCircle className="w-6 h-6 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Modelo no válido</h3>
                    <p className="text-amber-700">{data.error || 'El código introducido no parece ser un número de modelo de Apple válido.'}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ResultCard
                      icon={<Tag className="w-6 h-6 text-blue-500" />}
                      label="Estado del dispositivo"
                      value={data.status || 'Desconocido'}
                      color="blue"
                    />
                    <ResultCard
                      icon={<MapPin className="w-6 h-6 text-emerald-500" />}
                      label="Región de venta"
                      value={data.region || 'Desconocida'}
                      color="emerald"
                    />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visual Breakdown */}
        <ModelBreakdown />

        {/* References Section */}
        <div className="mt-16 pt-8 border-t border-gray-200 space-y-4">
          {/* Status Codes Reference List */}
          <div>
            <button
              type="button"
              onClick={() => setShowPrefixes(!showPrefixes)}
              className="w-full flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-200 hover:border-gray-300 transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl shrink-0">
                  <Tag className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-bold text-gray-900">Letras Iniciales (Estado)</h2>
                  <p className="text-sm text-gray-500">Referencia de la primera letra del modelo</p>
                </div>
              </div>
              <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${showPrefixes ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showPrefixes && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 pb-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {STATUS_CODES.map((status) => (
                      <div key={status.code} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-gray-300 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-gray-900 border border-gray-100 shrink-0">
                          {status.code}
                        </div>
                        <span className="text-sm text-gray-600 font-medium leading-tight">{status.description}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Region Codes Reference List */}
          <div>
            <button
              type="button"
              onClick={() => setShowRegions(!showRegions)}
              className="w-full flex items-center justify-between p-6 bg-white rounded-3xl border border-gray-200 hover:border-gray-300 transition-colors shadow-sm focus:outline-none focus:ring-4 focus:ring-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-50 rounded-2xl shrink-0">
                  <Globe className="w-6 h-6 text-gray-600" />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-bold text-gray-900">Códigos de Región Comunes</h2>
                  <p className="text-sm text-gray-500">Referencia de las letras antes de la barra (/)</p>
                </div>
              </div>
              <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${showRegions ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showRegions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 pb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {REGION_CODES.map((region) => (
                      <div key={region.code} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-gray-300 transition-colors">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center font-bold text-gray-900 border border-gray-100 shrink-0">
                          {region.code}
                        </div>
                        <span className="text-sm text-gray-600 font-medium leading-tight">{region.country}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelBreakdown() {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 mt-12 mb-12">
      <h3 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-2">
        <Info className="w-5 h-5 text-blue-500" />
        ¿Qué significa cada parte del código?
      </h3>
      
      <div className="flex items-center justify-center mb-10 overflow-x-auto pb-4">
        <div className="flex items-center text-4xl md:text-6xl font-mono font-bold tracking-widest bg-gray-50 px-8 py-6 rounded-2xl border border-gray-100 whitespace-nowrap">
          <span className="text-blue-500" title="Estado">M</span>
          <span className="text-gray-400" title="Identificador del dispositivo">XVU2</span>
          <span className="text-emerald-500" title="Región">LL</span>
          <span className="text-purple-500" title="Revisión de hardware">/A</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex gap-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
          <div>
            <span className="font-semibold text-gray-900 block mb-1">1. Estado (M)</span>
            <span className="text-gray-600 leading-relaxed">Indica si es Nuevo (M), Reacondicionado (F), Reemplazo (N) o Personalizado (P).</span>
          </div>
        </div>
        <div className="flex gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
          <div>
            <span className="font-semibold text-gray-900 block mb-1">2. Identificador (XVU2)</span>
            <span className="text-gray-600 leading-relaxed">Código interno de Apple que define el modelo exacto, capacidad y color.</span>
          </div>
        </div>
        <div className="flex gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
          <div>
            <span className="font-semibold text-gray-900 block mb-1">3. Región (LL)</span>
            <span className="text-gray-600 leading-relaxed">Indica el mercado para el que fue fabricado (ej. LL = EEUU, Y = España).</span>
          </div>
        </div>
        <div className="flex gap-3 p-4 rounded-2xl bg-purple-50/50 border border-purple-100/50">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
          <div>
            <span className="font-semibold text-gray-900 block mb-1">4. Revisión (/A)</span>
            <span className="text-gray-600 leading-relaxed">Indica la versión de hardware. "/A" es la primera versión de fábrica. Si hay cambios menores, puede ser "/B".</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: 'blue' | 'emerald' | 'purple' | 'amber' }) {
  const colorStyles = {
    blue: 'bg-blue-50 border-blue-100 text-blue-900',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-900',
    purple: 'bg-purple-50 border-purple-100 text-purple-900',
    amber: 'bg-amber-50 border-amber-100 text-amber-900',
  };

  return (
    <div className={`p-6 rounded-3xl border ${colorStyles[color]} flex items-start gap-4`}>
      <div className="p-3 bg-white rounded-2xl shadow-sm shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium opacity-80 mb-1">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
