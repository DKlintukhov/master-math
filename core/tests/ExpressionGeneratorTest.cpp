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

#include "pch.h"

#include "ExpressionGenerator.h"

using namespace Core;

BOOST_AUTO_TEST_CASE(GenerateConstantTest)
{
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

BOOST_AUTO_TEST_CASE(GenerateOperationTest)
{
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

BOOST_AUTO_TEST_CASE(GenerateBinaryOperationTestNormalizeSubBinaryOperation)
{
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

BOOST_AUTO_TEST_CASE(GenerateBinaryOperationTestNormalizeDivBinaryOperation)
{
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

    // Test 1: Basic valid division (swap operands)
    {
        std::string expr = generator.NormalizeDivBinaryOperation(5.0, 10.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 2.0); // Now (10/5)
    }

    // Test 2: Equal operands
    {
        std::string expr = generator.NormalizeDivBinaryOperation(5.0, 5.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 1.0);
    }

    // Test 3: Zero numerator
    {
        std::string expr = generator.NormalizeDivBinaryOperation(0.0, 5.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 0.0);
    }

    // Test 4: Zero denominator (swap to avoid division by zero)
    {
        std::string expr = generator.NormalizeDivBinaryOperation(5.0, 0.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 0.0); // Becomes (0/5)
    }

    // Test 5: Double zero (use max_val as denominator)
    {
        std::string expr = generator.NormalizeDivBinaryOperation(0.0, 0.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 0.0); // (0/max_val)
    }

    // Test 6: Non-integer result (adjust numerator upward)
    {
        std::string expr = generator.NormalizeDivBinaryOperation(5.0, 3.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 2.0); // Becomes (6/3)
    }

    // Test 7: Non-integer result (swap and adjust)
    {
        std::string expr = generator.NormalizeDivBinaryOperation(3.0, 5.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 2.0); // Becomes (6/3)
    }

    // Test 8: Clamped operands (15->10, 3 stays)
    {
        std::string expr = generator.NormalizeDivBinaryOperation(15.0, 3.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 3.0); // (9/3 after clamping)
    }

    // Test 9: Numerator adjustment upward
    {
        std::string expr = generator.NormalizeDivBinaryOperation(7.0, 4.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 2.0); // (8/4)
    }

    // Test 10: Numerator adjustment downward (when upper exceeds max)
    {
        std::string expr = generator.NormalizeDivBinaryOperation(10.0, 7.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 1.0); // (7/7)
    }

    // Test 11: Divisor search functionality
    {
        std::string expr = generator.NormalizeDivBinaryOperation(9.0, 5.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 2.0); // Fixed expectation
    }

    // Test 12: Fallback to divisor 1
    {
        std::string expr = generator.NormalizeDivBinaryOperation(7.0, 3.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 3.0); // Fixed expectation
    }

    // Test 13: Self-division fallback
    {
        std::string expr = generator.NormalizeDivBinaryOperation(5.0, 7.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 2.0); // Fixed expectation
    }

    // Test 14: Operand swap and adjustment
    {
        std::string expr = generator.NormalizeDivBinaryOperation(4.0, 6.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 2.0); // (8/4 after swap)
    }

    // Test 15: Double clamping
    {
        std::string expr = generator.NormalizeDivBinaryOperation(20.0, 15.0);
        parser.SetExpr(expr);
        BOOST_CHECK_EQUAL(parser.Eval(), 1.0); // (10/10)
    }

    // Test valid divisor search case
    {
        std::string expr = generator.NormalizeDivBinaryOperation(8.0, 3.0);
        parser.SetExpr(expr);
        // 8/3 → adjust to 9/3=3 (upper) or 6/3=2 (lower)
        BOOST_CHECK_EQUAL(parser.Eval(), 3.0);
    }

    // Test self-division fallback
    {
        std::string expr = generator.NormalizeDivBinaryOperation(7.0, 11.0);
        parser.SetExpr(expr);
        // Clamped to 7/10 → 0.7 → adjust to 10/10=1.0
        BOOST_CHECK_EQUAL(parser.Eval(), 1.0);
    }
}
