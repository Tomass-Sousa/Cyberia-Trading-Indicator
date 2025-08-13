//@version=5
indicator("Indicateur RSI + MACD (Panneau Inférieur)", overlay=false)

// === INPUTS ===
rsiLength = input.int(14, "Période RSI", minval=1)
showMACD = input.bool(true, "Afficher MACD")
showRSI = input.bool(true, "Afficher RSI")
macdFast = input.int(12, "MACD Fast", minval=1)
macdSlow = input.int(26, "MACD Slow", minval=1)
macdSignal = input.int(9, "MACD Signal", minval=1)

// Couleurs
rsiColor = input.color(color.purple, "Couleur RSI")
rsiOBColor = input.color(color.red, "Surachat RSI")
rsiOSColor = input.color(color.green, "Survente RSI")
macdColor = input.color(color.blue, "Ligne MACD")
macdSignalColor = input.color(color.orange, "Signal MACD")
macdBullColor = input.color(color.lime, "MACD Bullish Signal")
macdBearColor = input.color(color.maroon, "MACD Bearish Signal")

// Taille des signaux
signalSizeStr = input.string("Small", "Taille des signaux", options=["Tiny", "Small", "Normal", "Large"])
f_getSize(size) =>
    size == "Tiny" ? size.tiny :
     size == "Small" ? size.small :
     size == "Normal" ? size.normal :
     size.large

// === RSI ===
rsi = ta.rsi(close, rsiLength)
plot(showRSI ? rsi : na, title="RSI", color=rsiColor)
hline(70, "Surachat", color=rsiOBColor, linestyle=hline.style_dashed)
hline(30, "Survente", color=rsiOSColor, linestyle=hline.style_dashed)
hline(50, "Milieu", color=color.gray)

plotshape(showRSI and ta.crossover(rsi, 70), title="RSI Surachat", location=location.abovebar, color=rsiOBColor, style=shape.circle, size=f_getSize(signalSizeStr))
plotshape(showRSI and ta.crossunder(rsi, 30), title="RSI Survente", location=location.belowbar, color=rsiOSColor, style=shape.circle, size=f_getSize(signalSizeStr))

// === MACD ===
[macdLine, signalLine, _] = ta.macd(close, macdFast, macdSlow, macdSignal)
plot(showMACD ? macdLine : na, title="MACD", color=macdColor)
plot(showMACD ? signalLine : na, title="Signal MACD", color=macdSignalColor)

plotshape(showMACD and ta.crossover(macdLine, signalLine), title="MACD Bullish", location=location.belowbar, color=macdBullColor, style=shape.labelup, size=f_getSize(signalSizeStr))
plotshape(showMACD and ta.crossunder(macdLine, signalLine), title="MACD Bearish", location=location.abovebar, color=macdBearColor, style=shape.labeldown, size=f_getSize(signalSizeStr))
