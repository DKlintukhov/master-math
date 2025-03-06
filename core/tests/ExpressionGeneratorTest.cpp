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


#include <boost/test/unit_test.hpp>

#include "Expression.h"
#include "ExpressionGenerator.h"

using namespace Core;


BOOST_AUTO_TEST_CASE(GenerateConstantTest) {
    ExpressionGenerator::Config config;
    config.min = 1;
    config.max = 10;
    config.useAdd = true;
    config.useSub = true;
    config.useMul = true;
    config.useDiv = true;
    config.useFloats = true;

    ExpressionGenerator generator(config);

    Constant constant = generator.GenerateConstant();
    double value = constant.Evaluate();
    BOOST_CHECK(value >= config.min);
    BOOST_CHECK(value <= config.max);

    config.useFloats = false;
    ExpressionGenerator intGenerator(config);

    Constant intConstant = intGenerator.GenerateConstant();
    double intValue = intConstant.Evaluate();
    BOOST_CHECK(intValue >= config.min);
    BOOST_CHECK(intValue <= config.max);

    BOOST_CHECK(static_cast<int64_t>(intValue) == intValue);
}

BOOST_AUTO_TEST_CASE(GenerateOperationTest) {
    ExpressionGenerator::Config config;
    config.min = 1;
    config.max = 10;
    config.useAdd = true;
    config.useSub = false;
    config.useMul = true;
    config.useDiv = false;
    config.useFloats = true;

    ExpressionGenerator generator(config);

    Operation op = generator.GenerateOperation();
    BOOST_CHECK(op == Operation::Add || op == Operation::Mul);
}

BOOST_AUTO_TEST_CASE(GenerateBinaryOperationTest_NormalizeSubBinaryOperation) {
    ExpressionGenerator::Config config;
    config.min = 1.0;
    config.max = 20.0;
    config.useAdd = false;
    config.useSub = true;
    config.useMul = false;
    config.useDiv = false;
    config.useFloats = false;

    ExpressionGenerator generator(config);
    {
        BinaryOperation expr = generator.NormalizeSubBinaryOperation(Constant(5), Constant(10));
        BOOST_CHECK_EQUAL(expr.Evaluate(), 5.0);
    }

    {
        BinaryOperation expr = generator.NormalizeSubBinaryOperation(Constant(10), Constant(5));
        BOOST_CHECK_EQUAL(expr.Evaluate(), 5.0);
    }
}

BOOST_AUTO_TEST_CASE(GenerateBinaryOperationTest_NormalizeDivBinaryOperation) {
    ExpressionGenerator::Config config;
    config.min = 0.0;
    config.max = 10.0;
    config.useAdd = false;
    config.useSub = false;
    config.useMul = false;
    config.useDiv = true;
    config.useFloats = true;

    ExpressionGenerator generator(config);
    {
        BinaryOperation expr = generator.NormalizeDivBinaryOperation(Constant(5.0), Constant(10.0));
        BOOST_CHECK_EQUAL(expr.Evaluate(), 2.0);
    }

    {
        BinaryOperation expr = generator.NormalizeDivBinaryOperation(Constant(5.0), Constant(5.0));
        BOOST_CHECK_EQUAL(expr.Evaluate(), 1.0);
    }

    {
        BinaryOperation expr = generator.NormalizeDivBinaryOperation(Constant(0.0), Constant(5.0));
        BOOST_CHECK_EQUAL(expr.Evaluate(), 0.0);
    }

    {
        BinaryOperation expr = generator.NormalizeDivBinaryOperation(Constant(5.0), Constant(0.0));
        BOOST_CHECK_EQUAL(expr.Evaluate(), 0.0);
    }

    {
        BinaryOperation expr = generator.NormalizeDivBinaryOperation(Constant(0.0), Constant(0.0));
        BOOST_CHECK_EQUAL(expr.Evaluate(), 0.0);
    }

    {
        BinaryOperation expr = generator.NormalizeDivBinaryOperation(Constant(5.0), Constant(3.0));
        BOOST_CHECK_EQUAL(expr.Evaluate(), 5.0);
    }

    {
        BinaryOperation expr = generator.NormalizeDivBinaryOperation(Constant(3.0), Constant(5.0));
        BOOST_CHECK_EQUAL(expr.Evaluate(), 5.0);
    }
}
