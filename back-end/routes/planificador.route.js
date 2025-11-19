const express = require("express");
const router = express.Router();
const Receta = require("../models/receta.model");

function parsearFraccion(input) {
    if (!input) return 0;
    let valor = input.toString().trim();

    const fraccionesUnicode = {
        "¼": 0.25, "½": 0.5, "¾": 0.75,
        "⅐": 1 / 7, "⅑": 1 / 9, "⅒": 0.1,
        "⅓": 1 / 3, "⅔": 2 / 3,
        "⅕": 0.2, "⅖": 0.4, "⅗": 0.6, "⅘": 0.8,
        "⅙": 1 / 6, "⅚": 5 / 6,
        "⅛": 0.125, "⅜": 0.375, "⅝": 0.625, "⅞": 0.875
    };

    if (fraccionesUnicode[valor]) return fraccionesUnicode[valor];

    if (/^\d+$/.test(valor)) return Number(valor);

    const partes = valor.split(" ");
    if (partes.length === 2 && partes[1].includes("/")) {
        const entero = Number(partes[0]);
        const [num, den] = partes[1].split("/").map(Number);
        return entero + (num / den);
    }

    if (valor.includes("/")) {
        const [num, den] = valor.split("/").map(Number);
        return num / den;
    }

    return Number(valor) || 0;
}

function convertirCantidad(cantidad, unidad) {
    if (!unidad) return cantidad;
    const u = unidad.toLowerCase().trim();

    const conversiones = {
        "g": 1, "gramos": 1,
        "kg": 1000, "kilogramos": 1000,
        "lb": 453.592, "libras": 453.592,
        "oz": 28.3495, "onzas": 28.3495,
        "ml": 1, "mililitros": 1,
        "l": 1000, "litros": 1000,
        "cucharada": 15, "tbsp": 15,
        "cucharadita": 5, "tsp": 5,
        "taza": 240, "cup": 240
    };

    if (conversiones[u]) return cantidad * conversiones[u];
    return cantidad;
}

function normalizarIngrediente(ing) {
    const cantidadNum = parsearFraccion(ing.cantidad);
    const cantidadBase = convertirCantidad(cantidadNum, ing.unidad);

    const peso = ["g", "kg", "gramos", "kilogramos", "lb", "libras", "oz", "onzas"];
    const volumen = ["ml", "mililitros", "l", "litros", "cucharada", "tbsp", "cucharadita", "tsp", "taza", "cup"];

    let tipo;
    if (peso.includes(ing.unidad)) tipo = "peso";
    else if (volumen.includes(ing.unidad)) tipo = "volumen";
    else tipo = "unidad";

    return {
        nombre: ing.nombre.toLowerCase().trim(),
        cantidadBase,
        tipo
    };
}

function combinarIngredientes(lista) {
    const mapa = {};

    lista.forEach(ing => {
        const norm = normalizarIngrediente(ing);

        if (!mapa[norm.nombre]) {
            mapa[norm.nombre] = { ...norm };
        } else {
            mapa[norm.nombre].cantidadBase += norm.cantidadBase;
        }
    });

    return Object.values(mapa);
}

function formatearIngrediente(ing) {
    if (ing.tipo === "peso") {
        if (ing.cantidadBase >= 1000) return (ing.cantidadBase / 1000).toFixed(2) + " kg";
        return ing.cantidadBase.toFixed(0) + " g";
    }

    if (ing.tipo === "volumen") {
        if (ing.cantidadBase >= 1000) return (ing.cantidadBase / 1000).toFixed(2) + " l";
        return ing.cantidadBase.toFixed(0) + " ml";
    }

    return ing.cantidadBase + " unidades";
}

router.post("/lista-compra", async (req, res) => {
    const { recetas } = req.body;

    if (!recetas || !Array.isArray(recetas)) {
        return res.status(400).json({ mensaje: "Debe enviar un arreglo de IDs de recetas" });
    }

    try {
        const recetasDB = await Receta.find({ _id: { $in: recetas } });
        let ingredientesTotales = [];

        recetasDB.forEach(r => {
            r.ingredientes.forEach(i => ingredientesTotales.push(i));
        });

        const unificados = combinarIngredientes(ingredientesTotales);
        const salida = unificados.map(i => ({
            nombre: i.nombre,
            cantidad: formatearIngrediente(i)
        }));

        res.json({
            recetasSolicitadas: recetas.length,
            totalIngredientes: salida.length,
            listaCompra: salida
        });

    } catch (error) {
        res.status(500).json({ mensajeError: error.message });
    }
});

module.exports = router;