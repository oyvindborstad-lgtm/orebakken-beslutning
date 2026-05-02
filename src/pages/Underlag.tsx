import { useState } from "react";
import { Calculator, FileSpreadsheet, TrendingDown, AlertTriangle, ChevronDown } from "lucide-react";
import { FORUTSETNINGER } from "../data/forutsetninger";
import { TOTAL_SOLAR_VERDI_KR_AR } from "../lib/calc";
import { aarligKontantstromSnitt, nv } from "../lib/npv";
import { kr } from "../lib/format";

const { pakke1, pakke2, felles, manedlig } = FORUTSETNINGER;

export default function Underlag() {
  return (
    <div className="space-y-10 sm:space-y-12">
      <section>
        <div className="label">Fullstendig beregningsgrunnlag</div>
        <h1 className="display mt-3 max-w-3xl text-[28px] font-semibold leading-[1.05] tracking-tightest text-ink sm:text-[36px] lg:text-[44px]">
          Underlag og kvalitetssikring
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-ink/75 sm:mt-5 sm:text-[16.5px]">
          Detaljerte tabeller, månedlig energibalanse, FK-budsjett, nåverdi-analyse,
          følsomhetsanalyse og full liste over forutsetninger. Bruk denne siden for å
          ettergå hver eneste forutsetning og beregning.
        </p>
        <div className="mt-5 rounded-2xl border-l-4 border-warm bg-warm-bg/60 px-5 py-4 text-[14px] leading-relaxed text-ink/85">
          <strong>Status:</strong> Tallgrunnlaget bygger på vedtatt budsjett 21.04.2026,
          Elvia per-adresse-data 26.02.2026, og Istad fellesareal-data full kalenderår
          2025. Solar-overskudd og oppvarmingsbesparelse er omregnet ut fra disse.
          Modellen erstatter ikke en formell økonomisk vurdering — bruk den som
          beslutningsstøtte og kontroller mot egne beregninger.
        </div>
      </section>

      <Section icon={<FileSpreadsheet size={20} />} avsnitt="Avsnitt 1" tittel="Energibalanse — månedlig">
        <p className="text-[14.5px] leading-relaxed text-ink/80">
          Solcellene produserer mest om sommeren. Bergvarmens eget el-forbruk er
          størst om vinteren. Faktisk fellesareal-strøm fra Istad 2025 viser
          samme mønster. Kombinasjonen gir et betydelig sommer-overskudd som
          selges til nettet.
        </p>
        <ManedligTabell />
      </Section>

      <Section icon={<Calculator size={20} />} avsnitt="Avsnitt 2" tittel="Solenergi — to-pris-modell">
        <p className="text-[14.5px] leading-relaxed text-ink/80">
          Solcelleproduksjonen brukes først til å dekke fellesareal-strøm til
          forbrukspris (1,20 kr/kWh, samme som BRL i dag betaler). Det som
          overstiger fellesforbruket om sommeren selges til spot-pris (anslått
          0,50 kr/kWh — konservativt, kan være høyere ved gunstig markedsbilde).
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat label="Solar produksjon" value={`${felles.solcelleProduksjonKWh.toLocaleString("nb-NO")} kWh/år`} />
          <Stat label="Brukt til felles" value={`${felles.solcelleBruktTilFellesKWh.toLocaleString("nb-NO")} kWh/år`} sub={`${kr(felles.solcelleBruktTilFellesKWh * felles.stromPrisKrPerKWh)}/år`} />
          <Stat label="Overskudd selges" value={`${felles.solcelleOverskuddSommerKWh.toLocaleString("nb-NO")} kWh/år`} sub={`${kr(felles.solcelleOverskuddSommerKWh * felles.salgsprisKrPerKWh)}/år (spot 0,50)`} />
        </div>
        <div className="mt-4 rounded-xl bg-save-bg/60 px-5 py-4 text-[14px]">
          <strong>Total solar-verdi for BRL:</strong> {kr(TOTAL_SOLAR_VERDI_KR_AR)}/år
          → fordelt på 430 andeler etter brøk = ca. {kr(TOTAL_SOLAR_VERDI_KR_AR / 430 / 12)}/mnd snitt per andel.
        </div>
      </Section>

      <Section icon={<FileSpreadsheet size={20} />} avsnitt="Avsnitt 3" tittel="Investeringskostnader (lånegrunnlag)">
        <Tabell
          headers={["Post", "Pakke 1", "Pakke 1+2"]}
          rows={[
            ["Tak og fasader", "105 000 000", "105 000 000"],
            ["Betongrehabilitering", "65 000 000", "65 000 000"],
            ["Bergvarme (energibrønner + sentral)", "—", "160 000 000"],
            ["Solcelleanlegg (978 180 kWh/år)", "—", "11 000 000"],
            ["Prosjektledelse OBOS Prosjekt", "5 000 000", "10 000 000"],
            ["Uforutsette kostnader (10 % av total)", "17 000 000", "34 600 000"],
            ["(−) Bekreftet Enova-støtte (4 blokker)", "—", "−31 375 000"],
          ]}
          sumRow={["Samlet lånebeløp", "192 000 000", "354 225 000"]}
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Stat label="Pakke 1: rente / løpetid" value="5,00 % / 30 år" sub="vanlig felleslån, annuitet" />
          <Stat label="Pakke 1+2: rente / løpetid" value="4,90 % / 40 år" sub="grønt felleslån, annuitet" />
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Stat label="Månedlig termin P1 (BRL totalt)" value="1 030 698 kr" sub="12 368 370 kr/år" />
          <Stat label="Månedlig termin P1+2 (BRL totalt)" value="1 684 667 kr" sub="20 216 007 kr/år" />
        </div>
      </Section>

      <Section icon={<FileSpreadsheet size={20} />} avsnitt="Avsnitt 4" tittel="FK-budsjett rebudsjettert">
        <p className="text-[14.5px] leading-relaxed text-ink/80">
          Fra forutsetnings-arket (vedtatt budsjettgrunnlag, 21.04.2026):
          fellesutgifter rebudsjettert fra bunn med post-rehab driftskostnader,
          eksisterende lån, ny annuitet og likviditetsbuffer.
        </p>
        <Tabell
          headers={["Post", "Beløp (kr/år)"]}
          rows={[
            ["Driftskostnader normalisert (post-rehab)", "17 686 079"],
            ["Eksisterende lån (renter + avdrag)", "2 000 000"],
            ["Ny annuitet Pakke 1", "12 368 370"],
            ["Ny annuitet Pakke 1+2", "20 216 007"],
            ["Ønsket likviditetsoverskudd", "1 500 000"],
            ["(−) Renteinntekter bank", "−220 000"],
            ["(−) Andre driftsinntekter (lade, leil., trim)", "−1 050 000"],
            ["(−) Solar-effekt på FK (forbruk + salg)", `−${TOTAL_SOLAR_VERDI_KR_AR.toLocaleString("nb-NO")}`],
          ]}
          sumRow={["Nødvendig FK Pakke 1+2 (etter solar)", `${(32_734_449 + 20_216_007 - 12_368_370 - TOTAL_SOLAR_VERDI_KR_AR).toLocaleString("nb-NO")}`]}
        />
        <div className="mt-3 text-[12.5px] text-muted">
          NB: Tallene tilsvarer modellen i kildearket; solar-effekten er lagt til
          som ny linje for å vise at den reduserer behovet for FK-inndrag.
        </div>
      </Section>

      <Section icon={<TrendingDown size={20} />} avsnitt="Avsnitt 5" tittel="Nåverdi-analyse — andelseier-snitt">
        <NaverdiAnalyse />
      </Section>

      <Section icon={<AlertTriangle size={20} />} avsnitt="Avsnitt 6" tittel="Følsomhetsanalyse">
        <Folsomhetsanalyse />
      </Section>

      <Section icon={<FileSpreadsheet size={20} />} avsnitt="Avsnitt 7" tittel="Alle forutsetninger og konstanter">
        <Forutsetningsliste />
      </Section>
    </div>
  );
}

function Section({ icon, avsnitt, tittel, children }: { icon: React.ReactNode; avsnitt: string; tittel: string; children: React.ReactNode }) {
  return (
    <section className="card">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand">
          {icon}
        </div>
        <div>
          <div className="label">{avsnitt}</div>
          <h2 className="display mt-1.5 text-xl font-semibold text-ink sm:text-2xl">{tittel}</h2>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line/60 bg-surface/40 p-3.5">
      <div className="label">{label}</div>
      <div className="num mt-1 text-[15px] font-semibold text-ink sm:text-[16px]">{value}</div>
      {sub && <div className="mt-0.5 text-[11.5px] text-muted">{sub}</div>}
    </div>
  );
}

function Tabell({ headers, rows, sumRow }: { headers: string[]; rows: string[][]; sumRow?: string[] }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-2xl border border-line/70">
      <table className="w-full min-w-[560px] text-[13px]">
        <thead>
          <tr className="bg-brand text-white">
            {headers.map((h, i) => (
              <th key={h} className={`px-4 py-2.5 text-[10.5px] font-semibold uppercase tracking-wide ${i === 0 ? "text-left" : "text-right whitespace-nowrap"}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="num">
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "bg-surface/40" : "bg-paper"}>
              {r.map((cell, j) => (
                <td key={j} className={`border-b border-line/40 px-4 py-2 ${j === 0 ? "text-left text-ink" : "text-right whitespace-nowrap text-ink/85"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
          {sumRow && (
            <tr className="bg-brand-50 font-semibold">
              {sumRow.map((cell, j) => (
                <td key={j} className={`px-4 py-2.5 ${j === 0 ? "text-left text-ink" : "text-right whitespace-nowrap text-ink"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ManedligTabell() {
  const monthly = manedlig.map((m) => {
    const fellesPostP2 = m.bergvarme + m.ovrig;
    const solBrukt = Math.min(m.sol, fellesPostP2);
    const solOverskudd = Math.max(0, m.sol - fellesPostP2);
    return { ...m, fellesPostP2, solBrukt, solOverskudd };
  });
  const sum = monthly.reduce(
    (acc, m) => ({
      sol: acc.sol + m.sol,
      bergvarme: acc.bergvarme + m.bergvarme,
      ovrig: acc.ovrig + m.ovrig,
      fellesPostP2: acc.fellesPostP2 + m.fellesPostP2,
      solBrukt: acc.solBrukt + m.solBrukt,
      solOverskudd: acc.solOverskudd + m.solOverskudd,
    }),
    { sol: 0, bergvarme: 0, ovrig: 0, fellesPostP2: 0, solBrukt: 0, solOverskudd: 0 },
  );
  return (
    <div className="mt-4 overflow-x-auto rounded-2xl border border-line/70">
      <table className="w-full min-w-[760px] text-[13px]">
        <thead>
          <tr className="bg-brand text-white">
            {["Mnd", "Sol prod.", "Bergvarme", "Øvrig (Istad)", "Felles post-P2", "Sol brukt", "Sol overskudd"].map((h, i) => (
              <th key={h} className={`px-3 py-2.5 text-[10.5px] font-semibold uppercase tracking-wide whitespace-nowrap ${i === 0 ? "text-left" : "text-right"}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="num">
          {monthly.map((m, i) => (
            <tr key={m.mnd} className={i % 2 ? "bg-surface/40" : "bg-paper"}>
              <td className="border-b border-line/40 px-3 py-2 font-medium text-ink">{m.mnd}</td>
              <td className="border-b border-line/40 px-3 py-2 text-right whitespace-nowrap">{m.sol.toLocaleString("nb-NO")}</td>
              <td className="border-b border-line/40 px-3 py-2 text-right whitespace-nowrap">{m.bergvarme.toLocaleString("nb-NO")}</td>
              <td className="border-b border-line/40 px-3 py-2 text-right whitespace-nowrap">{m.ovrig.toLocaleString("nb-NO")}</td>
              <td className="border-b border-line/40 px-3 py-2 text-right whitespace-nowrap text-ink/70">{m.fellesPostP2.toLocaleString("nb-NO")}</td>
              <td className="border-b border-line/40 px-3 py-2 text-right whitespace-nowrap text-save">{m.solBrukt.toLocaleString("nb-NO")}</td>
              <td className="border-b border-line/40 px-3 py-2 text-right whitespace-nowrap text-warm-deep font-semibold">{m.solOverskudd.toLocaleString("nb-NO")}</td>
            </tr>
          ))}
          <tr className="bg-brand-50 font-bold">
            <td className="px-3 py-2.5 text-left text-ink">Sum</td>
            <td className="px-3 py-2.5 text-right whitespace-nowrap">{sum.sol.toLocaleString("nb-NO")}</td>
            <td className="px-3 py-2.5 text-right whitespace-nowrap">{sum.bergvarme.toLocaleString("nb-NO")}</td>
            <td className="px-3 py-2.5 text-right whitespace-nowrap">{sum.ovrig.toLocaleString("nb-NO")}</td>
            <td className="px-3 py-2.5 text-right whitespace-nowrap text-ink/70">{sum.fellesPostP2.toLocaleString("nb-NO")}</td>
            <td className="px-3 py-2.5 text-right whitespace-nowrap text-save">{sum.solBrukt.toLocaleString("nb-NO")}</td>
            <td className="px-3 py-2.5 text-right whitespace-nowrap text-warm-deep">{sum.solOverskudd.toLocaleString("nb-NO")}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function NaverdiAnalyse() {
  const [diskonteringsrente, setDiskonteringsrente] = useState(4);

  const p1 = aarligKontantstromSnitt("p1");
  const p2 = aarligKontantstromSnitt("p2");
  const npvP1 = nv(p1.verdi, diskonteringsrente);
  const npvP2 = nv(p2.verdi, diskonteringsrente);
  const sumUdiskontertP1 = p1.verdi.reduce((a, b) => a + b, 0);
  const sumUdiskontertP2 = p2.verdi.reduce((a, b) => a + b, 0);

  return (
    <div>
      <p className="text-[14.5px] leading-relaxed text-ink/80">
        Andelseier-snittet (430 andeler) sin årlige netto kontantstrøm —
        belastning over hele lånetiden — diskontert til nåverdi. Negative tall
        er total kostnad. Velg diskonteringsrente etter eget alternativ-avkastning
        (typisk 3–5 %).
      </p>
      <div className="mt-4 flex items-center gap-3">
        <label htmlFor="diskRente" className="label">Diskonteringsrente</label>
        <input
          id="diskRente"
          type="range"
          min={1}
          max={8}
          step={0.5}
          value={diskonteringsrente}
          onChange={(e) => setDiskonteringsrente(Number(e.target.value))}
          className="flex-1 max-w-md"
        />
        <span className="num font-semibold text-ink">{diskonteringsrente.toFixed(1).replace(".", ",")} %</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-line/70 bg-paper p-4">
          <div className="label">Pakke 1 — snitt-andel</div>
          <div className="mt-1 text-[13px] text-muted">Sum udiskontert (30 år):</div>
          <div className="num text-[18px] font-semibold text-ink">{kr(sumUdiskontertP1)}</div>
          <div className="mt-2 text-[13px] text-muted">NPV ved {diskonteringsrente.toFixed(1).replace(".", ",")} %:</div>
          <div className="num text-[20px] font-bold text-brand">{kr(npvP1)}</div>
        </div>
        <div className="rounded-2xl border border-warm/30 bg-warm-bg/40 p-4">
          <div className="label">Pakke 1+2 — snitt-andel</div>
          <div className="mt-1 text-[13px] text-muted">Sum udiskontert (40 år):</div>
          <div className="num text-[18px] font-semibold text-ink">{kr(sumUdiskontertP2)}</div>
          <div className="mt-2 text-[13px] text-muted">NPV ved {diskonteringsrente.toFixed(1).replace(".", ",")} %:</div>
          <div className="num text-[20px] font-bold text-warm-deep">{kr(npvP2)}</div>
        </div>
      </div>
      <p className="mt-4 text-[12.5px] leading-relaxed text-muted sm:text-[13px]">
        Tolkning: Tallene viser hva andelseier-snittet «taper» netto over
        lånetiden (kostnad netto av strømbesparelse, solenergi og skattefradrag).
        En lavere (mer negativ) NPV betyr høyere total belastning. Sammenligning
        P2 vs P1 viser merkostnaden for tilleggspakken i nåverdi.
      </p>
    </div>
  );
}

function Folsomhetsanalyse() {
  const [rente, setRente] = useState<number>(pakke2.rentePct);
  const [stromPris, setStromPris] = useState<number>(felles.stromPrisKrPerKWh);
  const [byggekostMult, setByggekostMult] = useState<number>(1.0);

  // Re-compute snitt-tall basert på endrede forutsetninger.
  // Brutto FK er proporsjonal med lånebeløp og avhenger av rente via annuitet.
  const lanesum = pakke2.laneSum * byggekostMult;
  const annuitet = (lanesum * (rente / 100 / 12)) / (1 - Math.pow(1 + rente / 100 / 12, -pakke2.nedbetalingAr * 12));

  // Strømbesparelse skalerer med strømpris (oppvarmingsbesparelse)
  const strømFaktor = stromPris / felles.stromPrisKrPerKWh;
  const oppvarmingsBespSnitt = 845 * strømFaktor;
  const solenergiSnitt = ((felles.solcelleBruktTilFellesKWh * stromPris + felles.solcelleOverskuddSommerKWh * felles.salgsprisKrPerKWh) / felles.antallAndeler) / 12;
  const totalStromBespSnitt = oppvarmingsBespSnitt + solenergiSnitt;

  // Skattefradrag — proporsjonal med rente × lånesum (omtrentlig)
  const totalRente = annuitet * 12 * pakke2.nedbetalingAr - lanesum;
  const snittRenteAr = totalRente / pakke2.nedbetalingAr;
  const skfrSnittKrMnd = (snittRenteAr * 0.22) / felles.antallAndeler / 12;

  // Brutto med ny rente og lånesum
  const bruttoNyMnd = annuitet / felles.antallAndeler;
  const baselineLaneAndelMnd = pakke2.arligTermin / 12 / felles.antallAndeler;
  const justertBruttoOkning = pakke2.bruttoSnittKrMnd + (bruttoNyMnd - baselineLaneAndelMnd);

  const nyNetto = justertBruttoOkning - totalStromBespSnitt - skfrSnittKrMnd;
  const baselineNetto = pakke2.nettoSnittKrMnd;
  const endring = nyNetto - baselineNetto;

  return (
    <div>
      <p className="text-[14.5px] leading-relaxed text-ink/80">
        Justér forutsetningene under for å se hvordan netto FK-økning P2 endrer
        seg fra dagens estimat (+1 257 kr/mnd snitt). Tabellen er beregnet
        live; tallene oppdateres mens du beveger glidebryterne.
      </p>
      <div className="mt-4 space-y-4 rounded-2xl border border-line/70 bg-surface/30 p-4 sm:p-5">
        <Slider label="Rente P1+2" value={rente} setValue={setRente} min={2} max={8} step={0.1} suffix=" %" />
        <Slider label="Strømpris" value={stromPris} setValue={setStromPris} min={0.4} max={2.5} step={0.1} suffix=" kr/kWh" />
        <Slider label="Byggekost (multiplikator)" value={byggekostMult} setValue={setByggekostMult} min={0.8} max={1.3} step={0.05} suffix="×" />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Stat label="Brutto FK-økning P2 / mnd snitt" value={`${justertBruttoOkning.toFixed(0)} kr`} sub={`baseline: ${pakke2.bruttoSnittKrMnd} kr`} />
        <Stat label="Strøm + solenergi snitt" value={`${totalStromBespSnitt.toFixed(0)} kr`} sub={`baseline: ${pakke2.stromBespSnittKrMnd} kr`} />
        <Stat label="Netto FK-økning snitt" value={`${nyNetto.toFixed(0)} kr/mnd`} sub={`endring: ${endring >= 0 ? "+" : ""}${endring.toFixed(0)} kr/mnd`} />
      </div>
      <div className="mt-4 rounded-xl border-l-4 border-warm bg-warm-bg/40 px-5 py-4 text-[13px] leading-relaxed text-ink/80">
        <strong>NB:</strong> Modellen approksimerer rente-effekt på skattefradrag og
        bruker forenklede formler. For nøyaktige tall, bruk profesjonell finansiell
        modell. Solenergi-salgspris (0,50 kr/kWh) er holdt fast; faktisk spot-pris
        varierer.
      </div>
    </div>
  );
}

function Slider({ label, value, setValue, min, max, step, suffix }: { label: string; value: number; setValue: (v: number) => void; min: number; max: number; step: number; suffix: string }) {
  return (
    <div className="flex items-center gap-3">
      <label className="label flex-1 sm:flex-none sm:w-44">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="flex-1 max-w-md"
      />
      <span className="num min-w-[80px] text-right font-semibold text-ink">
        {value.toFixed(2).replace(".", ",")}{suffix}
      </span>
    </div>
  );
}

function Forutsetningsliste() {
  const [open, setOpen] = useState(false);
  const items: [string, string][] = [
    ["Antall andeler", `${felles.antallAndeler}`],
    ["Antall blokker", `${felles.antallBlokker}`],
    ["Totalt areal", `${felles.totaltAreal.toLocaleString("nb-NO")} m²`],
    ["Privat strømforbruk (Elvia 26.02.2026)", `${felles.totalForbrukKWh.toLocaleString("nb-NO")} kWh/år`],
    ["Felles strømforbruk (Istad 2025)", `${felles.fellesForbrukKWh.toLocaleString("nb-NO")} kWh/år`],
    ["Felles strømkostnad i dag", `${felles.fellesKostnadKrAr.toLocaleString("nb-NO")} kr/år`],
    ["Oppvarming (75 % av privat)", `${felles.oppvarmingTotalKWh.toLocaleString("nb-NO")} kWh/år`],
    ["Strømpris forbruk", `${felles.stromPrisKrPerKWh.toString().replace(".", ",")} kr/kWh`],
    ["Strømpris salg (spot)", `${felles.salgsprisKrPerKWh.toString().replace(".", ",")} kr/kWh`],
    ["Skattesats rentefradrag", `${(felles.skattesats * 100).toFixed(0)} %`],
    ["Solar produksjon", `${felles.solcelleProduksjonKWh.toLocaleString("nb-NO")} kWh/år`],
    ["Bergvarme eget el-forbruk", `${felles.bergvarmeEgetForbrukKWh.toLocaleString("nb-NO")} kWh/år`],
    ["Bergvarme reduserer (% av oppvarming)", `${(felles.bergvarmeReduserer * 100).toFixed(0)} %`],
    ["Solar brukt til felles", `${felles.solcelleBruktTilFellesKWh.toLocaleString("nb-NO")} kWh/år`],
    ["Solar overskudd til salg", `${felles.solcelleOverskuddSommerKWh.toLocaleString("nb-NO")} kWh/år`],
    ["Enova bekreftet (4 blokker)", `${felles.enovaBekreftet.toLocaleString("nb-NO")} kr`],
    ["Enova søkes for (resterende)", `${felles.enovaSokerFor} blokker`],
    ["Pakke 1 lånebeløp", `${pakke1.laneSum.toLocaleString("nb-NO")} kr`],
    ["Pakke 1 nedbetalingstid", `${pakke1.nedbetalingAr} år`],
    ["Pakke 1 rente", `${pakke1.rentePct.toString().replace(".", ",")} %`],
    ["Pakke 1+2 lånebeløp", `${pakke2.laneSum.toLocaleString("nb-NO")} kr`],
    ["Pakke 1+2 nedbetalingstid", `${pakke2.nedbetalingAr} år`],
    ["Pakke 1+2 rente (grønt lån)", `${pakke2.rentePct.toString().replace(".", ",")} %`],
    ["Snitt FK i dag", `${felles.fkSnittIDagKrMnd.toLocaleString("nb-NO")} kr/mnd`],
    ["Dagens FK-budsjett 2026", `${felles.dagensBudsjettFKKrAr.toLocaleString("nb-NO")} kr/år`],
    ["Byggprisindeks per år (forutsatt)", `${(felles.byggprisIndeksPctPrAr * 100).toFixed(0)} %`],
  ];
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-line/60 bg-surface/40 px-4 py-3 text-[14px] font-semibold text-ink hover:border-brand/40"
      >
        <span>{open ? "Skjul" : "Vis"} alle forutsetninger ({items.length} verdier)</span>
        <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-3 overflow-hidden rounded-2xl border border-line/70">
          <table className="w-full text-[13px]">
            <tbody>
              {items.map(([k, v], i) => (
                <tr key={k} className={i % 2 ? "bg-surface/40" : "bg-paper"}>
                  <td className="border-b border-line/40 px-4 py-2 text-ink/80">{k}</td>
                  <td className="num border-b border-line/40 px-4 py-2 text-right font-semibold text-ink whitespace-nowrap">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
