//@version
indicator("Indicateur Pro Personnalisable + Styles + Tableau Latéral", overlay=true)

// === INPUTS PARAMÉTRABLES ===
// Couleurs EMAs
ema20Color = input.color(color.orange, "Couleur EMA 20")
ema50Color = input.color(color.teal, "Couleur EMA 50")
ema100Color = input.color(color.fuchsia, "Couleur EMA 100")
ema200Color = input.color(color.red, "Couleur EMA 200")

// Styles EMAs
emaLineStyle = input.string("Solide", "Style ligne EMA", options=["Solide", "Pointillé", "Point-Point-Point"])
emaLineWidth = input.int(2, "Épaisseur ligne EMA", minval=1, maxval=5)

// Opacité fonds (0 = transparent, 100 = opaque)
bgOpacityPerc = input.int(85, "Opacité fond tendance (%)", minval=0, maxval=100)

// Couleurs fonds bullish / bearish
bullBgColor = input.color(color.new(color.green, 80), "Couleur fond bullish")
bearBgColor = input.color(color.new(color.red, 80), "Couleur fond bearish")

// Couleurs signaux MACD
macdBullColor = input.color(color.lime, "Couleur signal MACD bullish")
macdBearColor = input.color(color.maroon, "Couleur signal MACD bearish")

// Couleurs signaux RSI
rsiOverboughtColor = input.color(color.red, "Couleur signal RSI surachat")
rsiOversoldColor = input.color(color.green, "Couleur signal RSI survente")

// Couleur bougies Heikin Ashi
haBullColor = input.color(color.green, "Couleur bougie HA bullish")
haBearColor = input.color(color.red, "Couleur bougie HA bearish")

// Autres options
showBB = input.bool(true, "Afficher Bandes de Bollinger")
useHA = input.bool(true, "Bougies Heikin Ashi")
showBackground = input.bool(true, "Afficher zones de fond tendance MACD/RSI")

// Alertes
alertEMA = input.bool(true, "Afficher alertes EMA 20/50")
alertMACD = input.bool(true, "Afficher alertes MACD")
alertRSI = input.bool(true, "Afficher alertes RSI")

// Taille et style des signaux
signalSizeStr = input.string("Small", "Taille des signaux", options=["Tiny", "Small", "Normal", "Large"])
signalShapeStyleEMAUpStr = input.string("TriangleUp", "Style signal EMA haussier", options=["TriangleUp", "Circle", "LabelUp"])
signalShapeStyleEMADownStr = input.string("TriangleDown", "Style signal EMA baissier", options=["TriangleDown", "Circle", "LabelDown"])

// Affichage RSI / MACD panneau inférieur
showRSIPlot = input.bool(true, "Afficher RSI panneau inférieur")
showMACDPlot = input.bool(true, "Afficher MACD panneau inférieur")

// Styles Bollinger
bbLineStyle = input.string("Pointillé", "Style ligne Bollinger", options=["Solide", "Pointillé", "Point-Point-Point"])
bbLineWidth = input.int(1, "Épaisseur ligne Bollinger", minval=1, maxval=5)

// Déviation Bollinger
bbDev = input.float(2.0, "Déviation Bollinger")

// Activation tableau latéral
showSidePanel = input.bool(true, "Afficher tableau latéral (PC uniquement)")

// ====================================================
// 🛠 Fonctions utilitaires
f_getLineStyle(style) =>
    style == "Solide" ? line.style_solid :
     style == "Pointillé" ? line.style_dotted :
     line.style_dashed

f_getSize(size) =>
    size == "Tiny" ? size.tiny :
     size == "Small" ? size.small :
     size == "Normal" ? size.normal :
     size.large

f_getShape(shapeStr) =>
     shapeStr == "TriangleUp" ? shape.triangleup :
     shapeStr == "TriangleDown" ? shape.triangledown :
     shapeStr == "Circle" ? shape.circle :
     shapeStr == "LabelUp" ? shape.labelup :
     shape.labeldown

bgOpacity = math.round(255 * (100 - bgOpacityPerc) / 100)

// === HEIKIN-ASHI
haClose = (open + high + low + close) / 4
var float haOpen = na
haOpen := na(haOpen[1]) ? (open + close) / 2 : (haOpen[1] + haClose[1]) / 2
haHigh = math.max(high, math.max(haClose, haOpen))
haLow = math.min(low, math.min(haClose, haOpen))
bodyColor = haClose > haOpen ? haBullColor : haBearColor

plotcandle(
    useHA ? haOpen : na,
    useHA ? haHigh : na,
    useHA ? haLow : na,
    useHA ? haClose : na,
    title="Bougies Heikin Ashi",
    color=bodyColor,
    wickcolor=color.gray,
    bordercolor=bodyColor
)

// === EMAS
ema20 = ta.ema(close, 20)
ema50 = ta.ema(close, 50)
ema100 = ta.ema(close, 100)
ema200 = ta.ema(close, 200)

plot(ema20, title="EMA 20", color=ema20Color, linewidth=emaLineWidth, style=f_getLineStyle(emaLineStyle))
plot(ema50, title="EMA 50", color=ema50Color, linewidth=emaLineWidth, style=f_getLineStyle(emaLineStyle))
plot(ema100, title="EMA 100", color=ema100Color, linewidth=emaLineWidth, style=f_getLineStyle(emaLineStyle))
plot(ema200, title="EMA 200", color=ema200Color, linewidth=emaLineWidth, style=f_getLineStyle(emaLineStyle))

emaCrossUp = ta.crossover(ema20, ema50)
emaCrossDown = ta.crossunder(ema20, ema50)

plotshape(alertEMA and emaCrossUp, title="Signal Achat EMA", location=location.belowbar, color=ema20Color, style=f_getShape(signalShapeStyleEMAUpStr), size=f_getSize(signalSizeStr))
plotshape(alertEMA and emaCrossDown, title="Signal Vente EMA", location=location.abovebar, color=ema50Color, style=f_getShape(signalShapeStyleEMADownStr), size=f_getSize(signalSizeStr))

// === BANDES DE BOLLINGER ===
bbBasis = ta.sma(close, 20)
bbUpper = bbBasis + bbDev * ta.stdev(close, 20)
bbLower = bbBasis - bbDev * ta.stdev(close, 20)

plot(showBB ? bbUpper : na, title="BB Supérieure", color=color.blue, linewidth=bbLineWidth, style=f_getLineStyle(bbLineStyle))
plot(showBB ? bbLower : na, title="BB Inférieure", color=color.blue, linewidth=bbLineWidth, style=f_getLineStyle(bbLineStyle))
plot(showBB ? bbBasis : na, title="BB Moyenne", color=color.gray, linewidth=bbLineWidth, style=f_getLineStyle(bbLineStyle))

// === RSI & MACD
rsi = ta.rsi(close, 14)
[macdLine, signalLine, _] = ta.macd(close, 12, 26, 9)

// Affichage
if showRSIPlot
    plot(rsi, title="RSI", color=color.purple, display=display.bottom)
    hline(70, "RSI Surachat", color=rsiOverboughtColor, linestyle=hline.style_dashed, display=display.bottom)
    hline(30, "RSI Survente", color=rsiOversoldColor, linestyle=hline.style_dashed, display=display.bottom)
    hline(50, "RSI Milieu", color=color.gray, display=display.bottom)

if showMACDPlot
    plot(macdLine, title="MACD", color=color.blue, display=display.bottom)
    plot(signalLine, title="Signal MACD", color=color.orange, display=display.bottom)

// Signaux RSI / MACD
rsiOverbought = ta.crossover(rsi, 70)
rsiOversold = ta.crossunder(rsi, 30)
plotshape(alertRSI and rsiOverbought, title="Signal RSI Surachat", location=location.abovebar, color=rsiOverboughtColor, style=shape.circle, size=f_getSize(signalSizeStr))
plotshape(alertRSI and rsiOversold, title="Signal RSI Survente", location=location.belowbar, color=rsiOversoldColor, style=shape.circle, size=f_getSize(signalSizeStr))

macdBullish = ta.crossover(macdLine, signalLine)
macdBearish = ta.crossunder(macdLine, signalLine)
plotshape(alertMACD and macdBullish, title="Signal MACD Haussier", location=location.belowbar, color=macdBullColor, style=shape.labelup, size=f_getSize(signalSizeStr))
plotshape(alertMACD and macdBearish, title="Signal MACD Baissier", location=location.abovebar, color=macdBearColor, style=shape.labeldown, size=f_getSize(signalSizeStr))

// === ZONES DE FOND TENDANCE
bullZone = macdLine > signalLine and rsi > 50
bearZone = macdLine < signalLine and rsi < 50
bgcolor(showBackground and bullZone ? color.new(bullBgColor, bgOpacity) : na)
bgcolor(showBackground and bearZone ? color.new(bearBgColor, bgOpacity) : na)

// === TABLEAU LATÉRAL
var label lbl_sidepanel = na
if showSidePanel
    f_formatValue(val) =>
        str.tostring(math.round(val * 100) / 100)
    macdTrend = macdLine > signalLine ? "Bullish" : "Bearish"
    rsiTrend = rsi > 50 ? "Bullish" : "Bearish"
    sidepanel_text = str.format(
      "📊 Résumé Indicateur\n\nEMA20: {0}\nEMA50: {1}\nEMA100: {2}\nEMA200: {3}\n\nRSI(14): {4} ({5})\nMACD: {6}/{7} ({8})",
      f_formatValue(ema20), f_formatValue(ema50), f_formatValue(ema100), f_formatValue(ema200),
      f_formatValue(rsi), rsiTrend,
      f_formatValue(macdLine), f_formatValue(signalLine), macdTrend
    )
    if not na(lbl_sidepanel)
        label.delete(lbl_sidepanel)
    lbl_sidepanel := label.new(bar_index + 5, high + tr, sidepanel_text,
      xloc.bar_index, yloc.price,
      style=label.style_label_left, color=color.new(color.black, 60), textcolor=color.white,
      size=size.normal, textalign=text.align_left)
else
    if not na(lbl_sidepanel)
        label.delete(lbl_sidepanel)
        lbl_sidepanel := na
