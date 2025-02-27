/*
* MIT License

* Copyright (c) 2025 Denis Klintukhov

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

#ifndef EXPRESSION_GENERATOR_H
#define EXPRESSION_GENERATOR_H

#include <random>
#include <vector>
#include "Expression.h"

namespace Core
{
    class ExpressionGenerator final
    {
    public:

    struct Config
    {
        int64_t min = 0;
        int64_t max = 100;
        bool useAdd = true;
        bool useSub = true;
        bool useMul = false;
        bool useDiv = false;
        bool useFloats = false;
    };
        explicit ExpressionGenerator(Config conf);

        std::unique_ptr<Expression> GenerateExpression();
        BinaryExpression GenerateBinaryExpression();
        BinaryExpression NormalizeSubBinaryExpression(Constant a, Constant b);
        BinaryExpression NormalizeDivBinaryExpression(Constant a, Constant b);
        Constant GenerateConstant();
        Operation GenerateOperation();

    private:
        Config m_config;
        std::vector<Operation> m_ops;
        std::mt19937 m_generator;
        std::uniform_int_distribution<int64_t> m_intDist;
        std::uniform_real_distribution<double> m_floatDist;
    };
}

#endif
