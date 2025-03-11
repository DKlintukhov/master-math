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

    double value = generator.GenerateConstant();
    BOOST_CHECK(value >= config.min);
    BOOST_CHECK(value <= config.max);

    config.useFloats = false;
    ExpressionGenerator intGenerator(config);

    double intValue = intGenerator.GenerateConstant();
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

    mu::Parser parser;
    ExpressionGenerator generator(config);
    {
        std::string expr = generator.NormalizeSubBinaryOperation(5.0, 10.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 5.0);
    }

    {
        std::string expr = generator.NormalizeSubBinaryOperation(10.0, 5.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 5.0);
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

    mu::Parser parser;
    ExpressionGenerator generator(config);
    {
        std::string expr = generator.NormalizeDivBinaryOperation(5.0, 10.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 2.0);
    }

    {
        std::string expr = generator.NormalizeDivBinaryOperation(5.0, 5.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 1.0);
    }

    {
        std::string expr = generator.NormalizeDivBinaryOperation(0.0, 5.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 0.0);
    }

    {
        std::string expr = generator.NormalizeDivBinaryOperation(5.0, 0.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 0.0);
    }

    {
        std::string expr = generator.NormalizeDivBinaryOperation(0.0, 0.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 0.0);
    }

    {
        std::string expr = generator.NormalizeDivBinaryOperation(5.0, 3.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 5.0);
    }

    {
        std::string expr = generator.NormalizeDivBinaryOperation(3.0, 5.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 5.0);
    }
}
